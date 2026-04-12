/**
 * Code executor Worker for CareCompass Code Mode.
 *
 * Executes AI-generated JavaScript in an isolated V8 context using the
 * UNSAFE_EVAL binding. Tool calls use a throw/catch/re-execute loop:
 * the code runs until it hits a tool call, pauses, the driver executes
 * the tool, then sends results back for re-execution.
 */

interface ToolSchema {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

interface ToolResultPayload {
  success: boolean
  value?: unknown
  error?: string
}

interface ToolCallRequest {
  id: string
  name: string
  args: unknown
}

interface ExecuteRequest {
  code: string
  tools: ToolSchema[]
  toolResults?: Record<string, ToolResultPayload>
  timeout?: number
}

type ExecuteResponse =
  | {
      status: 'done'
      success: boolean
      value?: unknown
      error?: { name: string; message: string; stack?: string }
      logs: string[]
    }
  | {
      status: 'need_tools'
      toolCalls: ToolCallRequest[]
      logs: string[]
      continuationId: string
    }
  | {
      status: 'error'
      error: { name: string; message: string }
    }

interface UnsafeEval {
  eval: (code: string) => unknown
}

interface Env {
  UNSAFE_EVAL?: UnsafeEval
}

function generateWrappedCode(
  code: string,
  tools: ToolSchema[],
  toolResults?: Record<string, ToolResultPayload>,
): string {
  const toolResultsJson = toolResults ? JSON.stringify(toolResults) : '{}'

  const wrappers = tools
    .map((tool) => {
      const name = tool.name
      if (toolResults) {
        return `
        async function ${name}(input) {
          const callId = 'tc_' + (__toolCallIdx++);
          const result = __toolResults[callId];
          if (!result) {
            __pendingToolCalls.push({ id: callId, name: '${name}', args: input });
            throw new __ToolCallNeeded(callId);
          }
          if (!result.success) throw new Error(result.error || 'Tool call failed');
          return result.value;
        }`
      }
      return `
      async function ${name}(input) {
        const callId = 'tc_' + (__toolCallIdx++);
        __pendingToolCalls.push({ id: callId, name: '${name}', args: input });
        throw new __ToolCallNeeded(callId);
      }`
    })
    .join('\n')

  return `
    (async function() {
      let __toolCallIdx = 0;
      const __pendingToolCalls = [];
      const __toolResults = ${toolResultsJson};
      const __logs = [];

      class __ToolCallNeeded extends Error {
        constructor(callId) {
          super('Tool call needed: ' + callId);
          this.callId = callId;
        }
      }

      function __fmt(...args) { return args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '); }
      const console = {
        log: (...args) => __logs.push(__fmt(...args)),
        error: (...args) => __logs.push('ERROR: ' + __fmt(...args)),
        warn: (...args) => __logs.push('WARN: ' + __fmt(...args)),
        info: (...args) => __logs.push('INFO: ' + __fmt(...args)),
        debug: (...args) => __logs.push('DEBUG: ' + __fmt(...args)),
        trace: (...args) => __logs.push('TRACE: ' + __fmt(...args)),
        dir: (obj) => __logs.push(JSON.stringify(obj, null, 2)),
        table: (data) => __logs.push(JSON.stringify(data)),
        assert: (cond, ...args) => { if (!cond) __logs.push('ASSERT: ' + __fmt(...args)); },
        time: () => {},
        timeEnd: () => {},
        timeLog: () => {},
        group: () => {},
        groupEnd: () => {},
        count: () => {},
        countReset: () => {},
        clear: () => {},
      };

      ${wrappers}

      try {
        const __userResult = await (async function() {
          ${code}
        })();
        // Check for pending tool calls even if user code swallowed the throw via try/catch
        if (__pendingToolCalls.length > 0) {
          return { status: 'need_tools', toolCalls: __pendingToolCalls, logs: __logs };
        }
        return { status: 'done', success: true, value: __userResult, logs: __logs };
      } catch (__error) {
        // Always check for pending tool calls first
        if (__pendingToolCalls.length > 0) {
          return { status: 'need_tools', toolCalls: __pendingToolCalls, logs: __logs };
        }
        return {
          status: 'done',
          success: false,
          error: { name: __error.name || 'Error', message: __error.message || String(__error) },
          logs: __logs,
        };
      }
    })()
  `
}

async function executeCode(
  request: ExecuteRequest,
  env: Env,
): Promise<ExecuteResponse> {
  if (!env.UNSAFE_EVAL) {
    return {
      status: 'error',
      error: {
        name: 'UnsafeEvalNotAvailable',
        message: 'UNSAFE_EVAL binding is not configured.',
      },
    }
  }

  const timeout = request.timeout ?? 30_000

  try {
    const wrappedCode = generateWrappedCode(
      request.code,
      request.tools,
      request.toolResults,
    )

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    type EvalResult = {
      status: string
      success?: boolean
      value?: unknown
      error?: { name: string; message: string; stack?: string }
      logs: string[]
      toolCalls?: ToolCallRequest[]
    }

    let result: EvalResult
    try {
      result = (await env.UNSAFE_EVAL.eval(wrappedCode)) as EvalResult
    } catch (evalErr) {
      clearTimeout(timeoutId)
      if (controller.signal.aborted) {
        return {
          status: 'error',
          error: {
            name: 'TimeoutError',
            message: `Execution timed out after ${timeout}ms`,
          },
        }
      }
      throw evalErr
    }
    clearTimeout(timeoutId)

    if (result.status === 'need_tools') {
      // Omit logs from intermediate rounds. The code re-executes from
      // scratch each round, so logs captured here include misleading
      // "Tool call needed" messages from the throw/catch mechanism.
      // The final 'done' round recaptures all real console output.
      return {
        status: 'need_tools',
        toolCalls: result.toolCalls || [],
        logs: [],
        continuationId: crypto.randomUUID(),
      }
    }

    return {
      status: 'done',
      success: result.success ?? false,
      value: result.value,
      error: result.error,
      logs: result.logs,
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return {
      status: 'error',
      error: { name: error.name, message: error.message },
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    try {
      const body: ExecuteRequest = await request.json()

      if (!body.code || typeof body.code !== 'string') {
        return new Response(JSON.stringify({ error: 'Code is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      }

      const result = await executeCode(body, env)

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      return new Response(
        JSON.stringify({
          status: 'error',
          error: { name: 'RequestError', message: error.message },
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        },
      )
    }
  },
}
