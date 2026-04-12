export interface GlossaryEntry {
  term: string;
  definition: string;      // accurate, standard definition
  simple: string;          // plain language, 1–2 sentences
  example?: string;        // optional real-world example
}

// Keys are lowercase canonical forms used for matching
export const GLOSSARY: Record<string, GlossaryEntry> = {
  "deductible": {
    term: "Deductible",
    definition: "The amount you pay for covered health services before your insurance begins to pay.",
    simple: "The amount you have to pay yourself each year before insurance starts helping. After you hit this number, insurance kicks in.",
    example: "If your deductible is $1,000, you pay the first $1,000 of medical bills yourself.",
  },
  "copay": {
    term: "Copay",
    definition: "A fixed amount you pay for a covered health care service, usually at the time of service.",
    simple: "A flat fee you pay each time you see a doctor or get a prescription. Like a cover charge for medical care.",
    example: "$20 copay means you pay $20 every time you visit your doctor.",
  },
  "co-pay": {
    term: "Copay",
    definition: "A fixed amount you pay for a covered health care service, usually at the time of service.",
    simple: "A flat fee you pay each time you see a doctor or get a prescription.",
    example: "$20 copay means you pay $20 every time you visit your doctor.",
  },
  "coinsurance": {
    term: "Coinsurance",
    definition: "Your share of the costs of a covered health care service, calculated as a percentage of the allowed amount.",
    simple: "After your deductible, you and your insurance split the bill by percentage. If your coinsurance is 20%, you pay 20% and insurance pays 80%.",
    example: "A $500 bill with 20% coinsurance means you owe $100.",
  },
  "co-insurance": {
    term: "Coinsurance",
    definition: "Your share of the costs of a covered health care service, calculated as a percentage.",
    simple: "After your deductible, you and your insurance split the bill by percentage.",
  },
  "premium": {
    term: "Premium",
    definition: "The amount you pay for your health insurance every month, regardless of whether you use medical services.",
    simple: "Your monthly bill for having health insurance — you pay this even if you never go to the doctor.",
    example: "If your premium is $200/month, that's $2,400 a year just to have coverage.",
  },
  "out-of-pocket maximum": {
    term: "Out-of-Pocket Maximum",
    definition: "The most you have to pay for covered services in a plan year. After you spend this amount, the insurance pays 100%.",
    simple: "The most you'll ever have to pay in a year. Once you hit this limit, insurance covers everything else for free.",
    example: "If your out-of-pocket max is $8,000, you'll never pay more than $8,000 no matter how sick you get.",
  },
  "out-of-pocket max": {
    term: "Out-of-Pocket Maximum",
    definition: "The most you have to pay for covered services in a plan year.",
    simple: "The most you'll ever have to pay in a year. Once you hit this limit, insurance covers everything else.",
  },
  "formulary": {
    term: "Formulary",
    definition: "A list of prescription drugs covered by your health insurance plan.",
    simple: "The list of medications your insurance will help pay for. If your drug isn't on this list, you may pay full price.",
  },
  "in-network": {
    term: "In-Network",
    definition: "Providers and facilities that have contracted with your health insurance plan to provide services at negotiated rates.",
    simple: "Doctors and hospitals your insurance has a deal with. Using them costs you less money.",
  },
  "out-of-network": {
    term: "Out-of-Network",
    definition: "Providers and facilities that have not contracted with your health plan. Services cost more or may not be covered.",
    simple: "Doctors and hospitals your insurance does NOT have a deal with. Using them costs you a lot more.",
  },
  "network": {
    term: "Network",
    definition: "The group of doctors, hospitals, and other providers your insurance plan has agreements with.",
    simple: "The group of doctors and hospitals your insurance works with. Staying 'in-network' saves you money.",
  },
  "hmo": {
    term: "HMO (Health Maintenance Organization)",
    definition: "A type of health plan that usually limits coverage to care from doctors who work for or contract with the HMO.",
    simple: "A type of insurance where you must use doctors in a specific group and usually need a referral to see a specialist. Usually cheaper premiums.",
  },
  "ppo": {
    term: "PPO (Preferred Provider Organization)",
    definition: "A type of health plan that contracts with medical providers, such as hospitals and doctors, to create a network of participating providers.",
    simple: "A type of insurance that lets you see any doctor without a referral. More flexibility, but usually higher premiums than an HMO.",
  },
  "epo": {
    term: "EPO (Exclusive Provider Organization)",
    definition: "A managed care plan where services are covered only if you use doctors, specialists, or hospitals in the plan's network.",
    simple: "Similar to an HMO — you must use the plan's network, no exceptions, or you pay everything out of pocket.",
  },
  "eob": {
    term: "EOB (Explanation of Benefits)",
    definition: "A statement sent by your insurance company after a claim is processed, showing what was covered and what you owe.",
    simple: "A document your insurance sends after a doctor visit explaining what they paid, what they didn't, and what you still owe. It is NOT a bill.",
  },
  "explanation of benefits": {
    term: "Explanation of Benefits (EOB)",
    definition: "A statement from your insurer explaining how a claim was processed, costs covered, and your remaining balance.",
    simple: "A summary from your insurance showing how they handled your doctor's bill. It's not a bill — it's just information.",
  },
  "fsa": {
    term: "FSA (Flexible Spending Account)",
    definition: "A special account you put pre-tax money into for health care costs. You must use it within the plan year.",
    simple: "A savings account for medical expenses using pre-tax dollars — so you save on taxes. Warning: unused money is usually lost at year end.",
  },
  "hsa": {
    term: "HSA (Health Savings Account)",
    definition: "A tax-advantaged account to pay for qualified medical expenses, available only with a high-deductible health plan.",
    simple: "A savings account for medical bills that grows tax-free. Unlike an FSA, the money rolls over year to year and is yours to keep.",
  },
  "fqhc": {
    term: "FQHC (Federally Qualified Health Center)",
    definition: "Community-based health care providers that receive funding to provide primary care in underserved areas.",
    simple: "A government-funded community clinic that charges based on what you can afford. If you have no insurance or low income, you can still get care here.",
  },
  "prior authorization": {
    term: "Prior Authorization",
    definition: "Approval from a health plan that may be required before you get a service or fill a prescription in order for that service to be covered.",
    simple: "Permission you need from your insurance before getting certain treatments or medications. Without it, insurance may not pay.",
  },
  "pre-authorization": {
    term: "Prior Authorization",
    definition: "Approval required from your insurer before receiving certain services or medications.",
    simple: "You need to ask your insurance for permission before getting certain treatments — otherwise they might not pay.",
  },
  "referral": {
    term: "Referral",
    definition: "A written order from your primary care doctor for you to see a specialist or get certain medical services.",
    simple: "A note from your regular doctor saying you need to see a specialist. Required by some insurance plans (especially HMOs).",
  },
  "claim": {
    term: "Claim",
    definition: "A request for payment that you or your health care provider submits to your health insurer after you receive medical services.",
    simple: "A bill sent to your insurance company asking them to pay for your medical care.",
  },
  "open enrollment": {
    term: "Open Enrollment",
    definition: "A period when you can sign up for health insurance or change your current plan.",
    simple: "A yearly window — usually in the fall — when you can pick or change your health insurance. Miss it, and you may have to wait.",
  },
  "special enrollment period": {
    term: "Special Enrollment Period",
    definition: "A time outside the annual open enrollment when you may sign up for health insurance due to a qualifying life event.",
    simple: "A chance to get insurance outside the normal sign-up window, usually after a big life change like losing a job, getting married, or having a baby.",
  },
  "medicaid": {
    term: "Medicaid",
    definition: "A joint federal and state program that provides health coverage to low-income people, families, children, pregnant women, elderly, and people with disabilities.",
    simple: "Free or very low-cost health insurance for people with low income. Each state runs its own version.",
  },
  "medicare": {
    term: "Medicare",
    definition: "Federal health insurance program primarily for people 65 or older, and certain younger people with disabilities.",
    simple: "Government health insurance for people 65 and older, or younger people with certain disabilities. Funded by the federal government.",
  },
  "chip": {
    term: "CHIP (Children's Health Insurance Program)",
    definition: "A program that provides low-cost health coverage to children in families that earn too much money to qualify for Medicaid.",
    simple: "Low-cost health insurance for kids whose families earn too much for Medicaid but can't afford private insurance.",
  },
  "cobra": {
    term: "COBRA",
    definition: "A federal law that lets you keep your employer's health insurance coverage after leaving a job, usually for up to 18 months.",
    simple: "A way to keep your work health insurance after you quit or get laid off. The catch: you pay the full cost yourself, which can be expensive.",
  },
  "bronze": {
    term: "Bronze Plan",
    definition: "An ACA Marketplace plan tier with the lowest monthly premium but highest out-of-pocket costs when you need care.",
    simple: "The cheapest monthly plan, but you pay more when you actually use medical care. Best if you're healthy and rarely see a doctor.",
  },
  "silver": {
    term: "Silver Plan",
    definition: "A mid-tier ACA Marketplace plan that balances premium costs with out-of-pocket expenses.",
    simple: "A middle-ground plan — moderate monthly cost, moderate bills when you need care. Required for cost-sharing reductions if you qualify.",
  },
  "gold": {
    term: "Gold Plan",
    definition: "An ACA Marketplace plan tier with higher monthly premiums but lower out-of-pocket costs when you receive care.",
    simple: "Higher monthly payments, but you pay less when you see a doctor. Good if you use medical care frequently.",
  },
  "sliding scale": {
    term: "Sliding Scale Fee",
    definition: "A payment schedule where the amount charged is based on the patient's ability to pay.",
    simple: "You pay based on what you can afford. If you have low income, you pay less — sometimes as little as $0.",
  },
};

// All canonical keys for regex matching (sorted longest-first to avoid partial matches)
export const GLOSSARY_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

// Build a regex that matches any glossary term at word boundaries
export const GLOSSARY_REGEX = new RegExp(
  `\\b(${GLOSSARY_TERMS.map((t) => t.replace(/[-/()]/g, "\\$&")).join("|")})\\b`,
  "gi"
);
