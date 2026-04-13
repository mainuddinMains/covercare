export type GlossaryCategory =
  | 'Coverage Basics'
  | 'Plan Types'
  | 'Costs & Billing'
  | 'Networks'
  | 'Enrollment'
  | 'Medicare'
  | 'Medicaid & CHIP'
  | 'Drugs & Pharmacy'
  | 'Legal Rights'
  | 'Documents'

export interface GlossaryTerm {
  term: string
  definition: string
  example: string
  category: GlossaryCategory
}

export const GLOSSARY: GlossaryTerm[] = [
  // Coverage Basics
  {
    term: 'Premium',
    definition: 'The amount you pay every month to keep your health insurance active, regardless of whether you use any healthcare services.',
    example: 'Your plan costs $320 per month. That $320 is your premium, due whether you see a doctor or not.',
    category: 'Coverage Basics',
  },
  {
    term: 'Deductible',
    definition: 'The amount you pay out-of-pocket for covered services before your insurance starts sharing costs. Once you meet it, insurance kicks in.',
    example: 'You have a $1,500 deductible. You get a $900 bill in January and a $700 bill in March. Insurance starts helping after that second bill pushes you past $1,500.',
    category: 'Coverage Basics',
  },
  {
    term: 'Copay',
    definition: 'A fixed dollar amount you pay for a specific service, like a doctor visit or prescription, usually at the time of service.',
    example: 'Your plan has a $30 copay for primary care visits. Every time you see your regular doctor, you pay $30 at the front desk.',
    category: 'Coverage Basics',
  },
  {
    term: 'Coinsurance',
    definition: 'After you meet your deductible, coinsurance is the percentage of costs you and your insurer split. You pay your percentage; they pay the rest.',
    example: 'Your coinsurance is 20%. An MRI costs $1,000. Your insurer pays $800 and you pay $200.',
    category: 'Coverage Basics',
  },
  {
    term: 'Out-of-Pocket Maximum',
    definition: 'The most you will ever pay in a plan year for covered services. Once you hit this cap, insurance covers 100% of covered costs for the rest of the year.',
    example: 'Your out-of-pocket maximum is $6,000. After a hospital stay, you have paid $6,000 total. A follow-up surgery later that year costs you nothing.',
    category: 'Coverage Basics',
  },
  {
    term: 'Covered Services',
    definition: 'The specific medical services, treatments, and medications that your insurance plan will pay for (fully or partially).',
    example: 'Preventive visits are a covered service under most ACA plans. Cosmetic surgery is typically not.',
    category: 'Coverage Basics',
  },
  {
    term: 'Benefit',
    definition: 'A service or item your insurance plan provides coverage for, such as doctor visits, lab tests, or mental health care.',
    example: 'Mental health visits are a benefit on your plan, covered at the same rate as regular medical visits.',
    category: 'Coverage Basics',
  },
  {
    term: 'Exclusion',
    definition: 'A service or condition your plan explicitly does not cover. Costs for excluded services are entirely your responsibility.',
    example: 'Acupuncture is an exclusion on your plan. If you get it, your insurer will not contribute anything toward the cost.',
    category: 'Coverage Basics',
  },
  {
    term: 'Claim',
    definition: 'A formal request submitted to your insurance company asking them to pay for a healthcare service you received.',
    example: 'Your doctor submits a claim after your visit. The insurer reviews it and pays their portion within 30 days.',
    category: 'Coverage Basics',
  },
  {
    term: 'Dependent',
    definition: 'A person covered under your health insurance plan, usually a spouse, domestic partner, or child up to age 26.',
    example: 'You add your 22-year-old daughter as a dependent on your plan so she is covered while in college.',
    category: 'Coverage Basics',
  },
  {
    term: 'Policyholder',
    definition: 'The primary person named on the insurance plan. Dependents are covered through the policyholder.',
    example: 'You are the policyholder. Your spouse and kids are covered as dependents under your plan.',
    category: 'Coverage Basics',
  },
  {
    term: 'Pre-existing Condition',
    definition: 'A health problem you had before your new insurance coverage started. Under the ACA, insurers cannot deny coverage or charge more because of these.',
    example: 'You had diabetes before enrolling. Under ACA marketplace plans, your insurer cannot charge you more or refuse to cover your diabetes care.',
    category: 'Coverage Basics',
  },
  {
    term: 'Essential Health Benefits',
    definition: 'Ten categories of services that all ACA-compliant plans must cover, including emergency care, maternity, mental health, and prescription drugs.',
    example: 'Because mental health is an essential health benefit, your marketplace plan cannot refuse to cover therapy sessions.',
    category: 'Coverage Basics',
  },
  {
    term: 'Preventive Care',
    definition: 'Routine checkups, screenings, and vaccines that help prevent illness or catch problems early. Most ACA plans cover these at no cost to you.',
    example: 'Your annual physical, flu shot, and cholesterol screening are preventive care and cost you $0 on most ACA plans.',
    category: 'Coverage Basics',
  },
  // Plan Types
  {
    term: 'HMO (Health Maintenance Organization)',
    definition: 'A plan that requires you to use a specific network of doctors and hospitals. You must choose a primary care physician and get referrals to see specialists.',
    example: 'You need to see a cardiologist. First, you call your HMO primary care doctor for a referral. Without it, the specialist visit likely will not be covered.',
    category: 'Plan Types',
  },
  {
    term: 'PPO (Preferred Provider Organization)',
    definition: 'A more flexible plan that lets you see any doctor, in-network or out-of-network, without a referral. In-network care costs less.',
    example: 'You want to see a dermatologist you found online. With a PPO, you can book directly without asking your regular doctor first.',
    category: 'Plan Types',
  },
  {
    term: 'EPO (Exclusive Provider Organization)',
    definition: 'Like a PPO without the out-of-network option. You can see specialists without referrals, but only in-network providers are covered.',
    example: 'Your EPO covers urgent care at any in-network clinic without a referral. If you visit an out-of-network facility, you pay the full bill.',
    category: 'Plan Types',
  },
  {
    term: 'POS (Point of Service)',
    definition: 'A hybrid of HMO and PPO. You have a primary care doctor and referrals are required for specialists, but you can go out-of-network at higher cost.',
    example: 'You have a POS plan. Your doctor gives you a referral to a specialist outside the network. You can still go, but you will pay more out-of-pocket.',
    category: 'Plan Types',
  },
  {
    term: 'HDHP (High-Deductible Health Plan)',
    definition: 'A plan with a high deductible (at least $1,650 for an individual in 2025) and lower premiums. Often paired with a Health Savings Account.',
    example: 'Your HDHP premium is $180/month but your deductible is $2,000. You are healthy and rarely see doctors, so you save money on premiums.',
    category: 'Plan Types',
  },
  {
    term: 'Catastrophic Plan',
    definition: 'A low-premium, very high-deductible plan available to people under 30 or those with a hardship exemption. Covers 3 primary care visits per year before the deductible.',
    example: 'You are 24, healthy, and want minimal coverage for emergencies only. A catastrophic plan costs very little monthly but covers almost nothing until you hit the high deductible.',
    category: 'Plan Types',
  },
  {
    term: 'Bronze Plan',
    definition: 'An ACA metal tier where your insurer pays about 60% of covered costs and you pay 40%. Lowest premiums but highest cost-sharing.',
    example: 'A Bronze plan might have a $7,000 deductible and a $400/month premium. Good if you are healthy and want to save on monthly costs.',
    category: 'Plan Types',
  },
  {
    term: 'Silver Plan',
    definition: 'An ACA metal tier where your insurer pays about 70% of covered costs. Middle-ground premiums and cost-sharing. The only tier eligible for cost-sharing reductions.',
    example: 'If you qualify for a cost-sharing reduction, enrolling in a Silver plan can dramatically lower your deductible and copays.',
    category: 'Plan Types',
  },
  {
    term: 'Gold Plan',
    definition: 'An ACA metal tier where your insurer pays about 80% of covered costs. Higher premiums but lower deductibles and cost-sharing.',
    example: 'You have a chronic condition and see doctors often. A Gold plan costs more per month but saves you money on every visit and prescription.',
    category: 'Plan Types',
  },
  {
    term: 'Platinum Plan',
    definition: 'The highest ACA metal tier. Your insurer pays about 90% of covered costs. Highest premiums, lowest cost-sharing. Best for people with frequent, expensive care.',
    example: 'You take four expensive specialty medications monthly. A Platinum plan has the highest premium but your monthly drug costs are minimal.',
    category: 'Plan Types',
  },
  // Costs & Billing
  {
    term: 'Explanation of Benefits (EOB)',
    definition: 'A document your insurer sends after processing a claim. It shows what was billed, what the insurer paid, and what you owe. It is not a bill.',
    example: 'You get an EOB in the mail after your ER visit. It shows the hospital charged $3,200, your insurer paid $1,800, and you owe $400. Wait for an actual bill from the hospital.',
    category: 'Costs & Billing',
  },
  {
    term: 'Allowed Amount',
    definition: 'The maximum amount your insurer has agreed to pay for a specific service with in-network providers. The provider cannot bill you more than this.',
    example: 'An MRI costs $2,000 at a hospital. Your insurer\'s allowed amount is $900. The hospital must accept $900 as full payment for in-network patients.',
    category: 'Costs & Billing',
  },
  {
    term: 'Balance Billing',
    definition: 'When a provider bills you for the difference between their charge and what your insurer paid. Illegal for in-network providers. The No Surprises Act limits this for out-of-network emergency care.',
    example: 'An out-of-network surgeon charges $5,000. Your insurer pays $2,000. The surgeon tries to bill you the remaining $3,000. That is balance billing.',
    category: 'Costs & Billing',
  },
  {
    term: 'Upcoding',
    definition: 'A billing error or fraud where a provider uses a higher billing code than the service performed, resulting in a larger charge.',
    example: 'You had a quick 10-minute check-up but the bill shows a code for a comprehensive 45-minute exam. That is upcoding and you can dispute it.',
    category: 'Costs & Billing',
  },
  {
    term: 'Unbundling',
    definition: 'Billing separately for procedures that should be billed together at a combined rate, resulting in a higher total charge.',
    example: 'A lab bills each component of a blood panel separately instead of using the standard panel code. The total comes out much higher than it should.',
    category: 'Costs & Billing',
  },
  {
    term: 'Itemized Bill',
    definition: 'A detailed, line-by-line breakdown of every charge on your medical bill. You have the legal right to request one. It is essential for spotting errors.',
    example: 'You get a hospital bill for $8,000 with no detail. You request an itemized bill and find a $150 charge for a toothbrush you never received.',
    category: 'Costs & Billing',
  },
  {
    term: 'Prior Authorization',
    definition: 'Approval from your insurance company that certain services, drugs, or procedures are medically necessary before you receive them. Without it, coverage may be denied.',
    example: 'Your doctor wants to order an MRI. Before scheduling, the clinic calls your insurer to get prior authorization. If denied, you can appeal.',
    category: 'Costs & Billing',
  },
  {
    term: 'Medical Billing Code (CPT)',
    definition: 'A five-digit code used by providers to bill for specific services. CPT stands for Current Procedural Terminology. These codes determine how much insurance pays.',
    example: 'Your office visit is billed as CPT 99213 (moderate complexity). If your doctor coded it as 99215 (high complexity) for a simple visit, that is upcoding.',
    category: 'Costs & Billing',
  },
  {
    term: 'ICD Code',
    definition: 'A diagnosis code (International Classification of Diseases) that providers use to tell your insurer what medical condition was treated.',
    example: 'Your doctor uses ICD code E11.9 for Type 2 diabetes on your claim. If the wrong code is used, your claim may be denied or your coverage applied incorrectly.',
    category: 'Costs & Billing',
  },
  {
    term: 'Superbill',
    definition: 'A detailed receipt from a provider that lists all services, diagnoses, and codes. Used to submit a claim yourself, often when seeing an out-of-network provider.',
    example: 'You see an out-of-network therapist. They give you a superbill monthly. You submit it to your insurer to get reimbursed.',
    category: 'Costs & Billing',
  },
  {
    term: 'Coordination of Benefits',
    definition: 'The process of figuring out which insurance plan pays first when you are covered by more than one plan.',
    example: 'You are on your employer plan and your spouse\'s plan. Coordination of benefits determines which pays as primary and which as secondary to avoid double payment.',
    category: 'Costs & Billing',
  },
  {
    term: 'Observation Status',
    definition: 'A hospital designation where you are monitored but not formally admitted as an inpatient. This affects what Medicare and insurance will cover, often resulting in higher bills.',
    example: 'You spend two nights in the hospital but are in "observation status." Medicare Part B covers it differently than inpatient care, and you may owe more.',
    category: 'Costs & Billing',
  },
  {
    term: 'Facility Fee',
    definition: 'An additional charge hospitals and health systems add for using their facilities, even for routine outpatient visits. Often unexpected and sometimes not covered.',
    example: 'You visit a doctor\'s office now owned by a hospital system. Besides the doctor\'s fee, you get a separate facility fee bill for $300.',
    category: 'Costs & Billing',
  },
  // Networks
  {
    term: 'Network',
    definition: 'The group of doctors, hospitals, and other providers that have a contract with your insurance company to provide services at agreed-upon rates.',
    example: 'Your plan\'s network includes General Hospital downtown but not St. Mary\'s across town. Going to St. Mary\'s means higher costs or no coverage.',
    category: 'Networks',
  },
  {
    term: 'In-Network',
    definition: 'A provider who has a contract with your insurer and agrees to accept the insurer\'s allowed amount. Your costs are lowest when you stay in-network.',
    example: 'Dr. Chen is in-network. Your visit costs you a $30 copay. If you saw an out-of-network doctor for the same visit, you might owe $200.',
    category: 'Networks',
  },
  {
    term: 'Out-of-Network',
    definition: 'A provider who does not have a contract with your insurer. You usually pay significantly more, and some plans cover nothing out-of-network.',
    example: 'A specialist you want to see is out-of-network. Your PPO covers 50% of their bill, but you are responsible for the other half plus the full balance.',
    category: 'Networks',
  },
  {
    term: 'Primary Care Physician (PCP)',
    definition: 'Your main doctor for general health needs, checkups, and referrals. HMO and POS plans require you to designate one.',
    example: 'Your PCP is your first call when you are sick. They treat common conditions and refer you to specialists when needed.',
    category: 'Networks',
  },
  {
    term: 'Referral',
    definition: 'A written or electronic authorization from your primary care doctor to see a specialist. Required by HMO and POS plans.',
    example: 'You need to see an orthopedic surgeon. Your HMO PCP gives you a referral. Without it, your insurer may refuse to pay the specialist bill.',
    category: 'Networks',
  },
  {
    term: 'Specialist',
    definition: 'A doctor who focuses on a specific area of medicine, such as cardiology, dermatology, or psychiatry.',
    example: 'Your PCP notices a suspicious mole and refers you to a dermatologist, who is a specialist in skin conditions.',
    category: 'Networks',
  },
  {
    term: 'Urgent Care Center',
    definition: 'A walk-in clinic for non-life-threatening conditions that need prompt attention. Usually cheaper than the ER and often open evenings and weekends.',
    example: 'You sprain your ankle on a Saturday. You go to urgent care instead of the ER, saving hundreds of dollars with a much shorter wait.',
    category: 'Networks',
  },
  {
    term: 'Emergency Room (ER)',
    definition: 'The hospital department for life-threatening or serious emergencies. Under the ACA and No Surprises Act, in-network cost-sharing applies even at out-of-network ERs.',
    example: 'You have chest pain and go to the nearest ER, which is out-of-network. Federal law requires your insurer to cover it at in-network rates.',
    category: 'Networks',
  },
  {
    term: 'Federally Qualified Health Center (FQHC)',
    definition: 'A government-funded community clinic that provides care regardless of ability to pay, using a sliding-scale fee based on income.',
    example: 'You are uninsured and low income. The FQHC near you charges you $20 for a visit based on what you can afford.',
    category: 'Networks',
  },
  {
    term: 'Telehealth',
    definition: 'Healthcare services delivered remotely via phone or video. Many plans cover telehealth visits, often at a lower copay than in-person care.',
    example: 'You have a sinus infection at 9 PM. Instead of urgent care, you do a $0 telehealth visit on your phone and get a prescription in 20 minutes.',
    category: 'Networks',
  },
  // Enrollment
  {
    term: 'Open Enrollment',
    definition: 'The annual period when you can sign up for or change your health insurance plan. For ACA marketplace plans, it typically runs from November 1 to January 15.',
    example: 'Open enrollment starts November 1. If you miss it and do not have a qualifying life event, you may have to wait until next year to get coverage.',
    category: 'Enrollment',
  },
  {
    term: 'Special Enrollment Period (SEP)',
    definition: 'A window outside of open enrollment when you can sign up for health insurance due to a qualifying life event such as losing other coverage, marriage, or having a baby.',
    example: 'You lose your job and your employer coverage ends June 30. You have 60 days from that date to enroll in a marketplace plan through a special enrollment period.',
    category: 'Enrollment',
  },
  {
    term: 'Qualifying Life Event',
    definition: 'A major life change that triggers eligibility for a special enrollment period, such as job loss, marriage, divorce, birth, adoption, or moving.',
    example: 'You get married in August. That is a qualifying life event. You now have 60 days to add your spouse to your plan or enroll in a new one.',
    category: 'Enrollment',
  },
  {
    term: 'COBRA',
    definition: 'A federal law that lets you continue your employer\'s group health insurance for up to 18 months after leaving a job, but you pay the full premium yourself.',
    example: 'You resign in March. Your employer was paying $400/month and you paid $100. Under COBRA, you now pay the full $500 plus a 2% admin fee.',
    category: 'Enrollment',
  },
  {
    term: 'Grace Period',
    definition: 'A set number of days after your premium due date during which you can pay late without losing coverage.',
    example: 'Your premium is due the 1st. Your plan has a 30-day grace period. If you pay by the 30th, your coverage remains active.',
    category: 'Enrollment',
  },
  {
    term: 'Waiting Period',
    definition: 'The time between when you become eligible for employer coverage and when coverage actually starts. Legally limited to 90 days.',
    example: 'You start a new job on March 1 with a 60-day waiting period. Your health benefits do not begin until May 1.',
    category: 'Enrollment',
  },
  {
    term: 'Marketplace',
    definition: 'The government-run website (HealthCare.gov or a state exchange) where you can compare and enroll in ACA health insurance plans and apply for subsidies.',
    example: 'You go to HealthCare.gov, enter your income and family size, and see which plans you qualify for and what subsidies lower your premium.',
    category: 'Enrollment',
  },
  {
    term: 'Premium Tax Credit',
    definition: 'A subsidy the government provides to lower your monthly marketplace insurance premium if your income falls between 100% and 400% of the federal poverty level.',
    example: 'A plan costs $500/month. Based on your income, you qualify for a $300 premium tax credit. You pay only $200/month.',
    category: 'Enrollment',
  },
  {
    term: 'Cost-Sharing Reduction (CSR)',
    definition: 'Extra savings available only on Silver marketplace plans that lower your deductible, copays, and out-of-pocket maximum if your income qualifies.',
    example: 'A standard Silver plan has a $4,000 deductible. With a CSR, your deductible drops to $800. You must pick a Silver plan to get this benefit.',
    category: 'Enrollment',
  },
  {
    term: 'Federal Poverty Level (FPL)',
    definition: 'A measure of income issued annually by the government, used to determine eligibility for subsidies, Medicaid, and other assistance programs.',
    example: 'In 2025, 100% FPL for a single person is about $15,060/year. Many assistance programs kick in at 138% or 200% of FPL.',
    category: 'Enrollment',
  },
  // Medicare
  {
    term: 'Medicare',
    definition: 'A federal health insurance program primarily for people 65 and older, and for some younger people with disabilities or specific conditions.',
    example: 'You turn 65 in June. You are automatically enrolled in Medicare Part A if you already receive Social Security benefits.',
    category: 'Medicare',
  },
  {
    term: 'Medicare Part A',
    definition: 'The hospital insurance portion of Medicare. Covers inpatient hospital stays, skilled nursing facility care, hospice, and some home health. Most people pay no premium.',
    example: 'You are hospitalized for surgery. Medicare Part A covers the hospital stay after you pay your Part A deductible of about $1,600 per benefit period.',
    category: 'Medicare',
  },
  {
    term: 'Medicare Part B',
    definition: 'The medical insurance portion of Medicare. Covers doctor visits, outpatient care, preventive services, and medical equipment. Requires a monthly premium.',
    example: 'Your Part B premium is $174.70/month in 2025. It covers your primary care visits, lab tests, and durable medical equipment like a walker.',
    category: 'Medicare',
  },
  {
    term: 'Medicare Part C (Medicare Advantage)',
    definition: 'An alternative to Original Medicare offered by private insurers. Bundles Parts A and B (often with Part D) into one plan, usually with additional benefits.',
    example: 'You choose a Medicare Advantage plan that includes dental, vision, gym membership, and drug coverage in one plan with a $0 premium.',
    category: 'Medicare',
  },
  {
    term: 'Medicare Part D',
    definition: 'Medicare\'s prescription drug coverage, provided through private insurance plans. Helps cover the cost of prescription medications.',
    example: 'You take three maintenance medications. Your Part D plan covers two generics at $10/month each and one brand-name drug at $45/month.',
    category: 'Medicare',
  },
  {
    term: 'Medigap (Medicare Supplement)',
    definition: 'Private insurance that fills the gaps in Original Medicare, such as deductibles, coinsurance, and copays.',
    example: 'Medicare pays 80% of your outpatient costs. Your Medigap policy pays the remaining 20%, so you pay virtually nothing out-of-pocket.',
    category: 'Medicare',
  },
  {
    term: 'Medicare Initial Enrollment Period',
    definition: 'A 7-month window around your 65th birthday when you can first sign up for Medicare without penalty.',
    example: 'You turn 65 in September. Your initial enrollment window runs from June through December. Missing it may mean a lifetime late-enrollment penalty.',
    category: 'Medicare',
  },
  {
    term: 'Medicare Late Enrollment Penalty',
    definition: 'A permanent premium increase for people who did not sign up for Medicare Part B or Part D when first eligible and did not have qualifying other coverage.',
    example: 'You delayed Part B enrollment for 2 years without employer coverage. Your Part B premium is permanently 20% higher as a result.',
    category: 'Medicare',
  },
  {
    term: 'Extra Help (Low Income Subsidy)',
    definition: 'A federal program that helps Medicare beneficiaries with limited income and resources pay for Part D prescription drug costs.',
    example: 'You qualify for Extra Help based on income. Your Part D plan premium is covered and your drug copays drop to a few dollars per prescription.',
    category: 'Medicare',
  },
  // Medicaid & CHIP
  {
    term: 'Medicaid',
    definition: 'A joint federal and state program that provides free or low-cost health coverage to people with limited income. Eligibility rules vary by state.',
    example: 'Your annual income is $18,000 and your state expanded Medicaid. You qualify for Medicaid and pay little to nothing for healthcare.',
    category: 'Medicaid & CHIP',
  },
  {
    term: 'CHIP (Children\'s Health Insurance Program)',
    definition: 'Provides low-cost health coverage to children in families that earn too much to qualify for Medicaid but cannot afford private insurance.',
    example: 'Your family income is $55,000 with two kids. You do not qualify for Medicaid but your children qualify for CHIP with low monthly premiums.',
    category: 'Medicaid & CHIP',
  },
  {
    term: 'Medicaid Expansion',
    definition: 'An ACA provision that allows states to extend Medicaid eligibility to adults with incomes up to 138% of the federal poverty level. Not all states have adopted it.',
    example: 'You earn $20,000 in a Medicaid expansion state. You qualify for Medicaid. The same person in a non-expansion state may not qualify.',
    category: 'Medicaid & CHIP',
  },
  {
    term: 'Dual Eligible',
    definition: 'People who qualify for both Medicare and Medicaid. Medicare pays first; Medicaid may cover remaining costs.',
    example: 'You are 68, low income, and have a disability. You are dual eligible. Medicaid often covers your Part B premium and out-of-pocket Medicare costs.',
    category: 'Medicaid & CHIP',
  },
  {
    term: 'Managed Care Organization (MCO)',
    definition: 'A private company contracted by Medicaid or Medicare to manage care and costs for enrollees. Common way states administer Medicaid.',
    example: 'Your state contracts with Anthem to manage Medicaid. You enroll in Anthem\'s Medicaid MCO and receive your coverage through them.',
    category: 'Medicaid & CHIP',
  },
  // Drugs & Pharmacy
  {
    term: 'Formulary',
    definition: 'Your insurance plan\'s list of covered prescription drugs, organized into tiers that determine your cost. Drugs not on the formulary are not covered.',
    example: 'Your plan\'s formulary has Tier 1 generics at $10 and Tier 3 brand-names at $60. Your doctor prescribes a Tier 4 specialty drug not on the formulary, so you pay full price.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'Generic Drug',
    definition: 'A medication that contains the same active ingredient as a brand-name drug but is sold at a much lower price after the patent expires.',
    example: 'Your doctor prescribes Lipitor (brand name). The pharmacist offers atorvastatin (generic), the same drug for $8 instead of $150.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'Brand-Name Drug',
    definition: 'A prescription medication sold under a trademarked name by the company that developed and patented it. Usually much more expensive than generics.',
    example: 'Advair is a brand-name asthma inhaler. The generic version (fluticasone/salmeterol) may be 80% cheaper and equally effective.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'Specialty Drug',
    definition: 'A high-cost medication that treats complex or rare conditions. Often requires special handling, administration, or monitoring. Usually in the highest formulary tier.',
    example: 'You take a biologic injection for rheumatoid arthritis. It is a specialty drug at $2,000/month retail, but your plan caps your copay at $150.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'Step Therapy',
    definition: 'A practice where your insurer requires you to try a cheaper drug first before covering a more expensive one, even if your doctor prescribed the expensive one.',
    example: 'Your doctor prescribes a new brand-name antidepressant. Your insurer requires you to try two generic antidepressants first. If those fail, they will cover the brand.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'DAW (Dispense as Written)',
    definition: 'A note from your doctor on a prescription indicating that the brand-name drug must be dispensed and no generic substitution is allowed.',
    example: 'Your doctor writes DAW on your prescription because you had a reaction to the generic. The pharmacist cannot substitute the generic version.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'Pharmacy Benefit Manager (PBM)',
    definition: 'A third-party company that manages prescription drug benefits on behalf of health insurers, negotiating prices with drug makers and pharmacies.',
    example: 'Your insurer\'s PBM negotiates with manufacturers and sets which drugs are on the formulary and what you pay at the pharmacy.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'Drug Tier',
    definition: 'The level assigned to a drug in your plan\'s formulary that determines your cost-sharing. Tier 1 is cheapest (generics), Tier 4 or 5 is most expensive (specialty).',
    example: 'Your blood pressure medication is Tier 1 at $5/month. A new cholesterol drug your doctor wants is Tier 4 at $100/month.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'Mail-Order Pharmacy',
    definition: 'A pharmacy service that delivers a 90-day supply of maintenance medications by mail, usually at a lower cost than a 30-day retail supply.',
    example: 'You take metformin daily for diabetes. Getting a 90-day mail-order supply costs $15 instead of $10 per month three times over.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'Quantity Limit',
    definition: 'A restriction your plan places on how much of a drug it will cover in a given time period. Exceeding the limit requires prior authorization.',
    example: 'Your plan covers 30 migraine pills per month. Your doctor prescribes 45. You need prior authorization for the extra 15.',
    category: 'Drugs & Pharmacy',
  },
  {
    term: 'Medicare Donut Hole',
    definition: 'A coverage gap in Medicare Part D where you temporarily pay more for drugs after you and your plan spend a certain amount, until you reach catastrophic coverage.',
    example: 'After you and your Part D plan spend $5,030 combined on drugs, you enter the donut hole and pay 25% of costs until your out-of-pocket hits $8,000.',
    category: 'Drugs & Pharmacy',
  },
  // Legal Rights
  {
    term: 'No Surprises Act',
    definition: 'A 2022 federal law that protects patients from unexpected out-of-network bills for emergency care and certain services at in-network facilities.',
    example: 'You have knee surgery at an in-network hospital. An out-of-network anesthesiologist is used without your knowledge. The No Surprises Act caps what they can bill you.',
    category: 'Legal Rights',
  },
  {
    term: 'Good Faith Estimate',
    definition: 'Under the No Surprises Act, uninsured or self-pay patients can request a written estimate of expected charges before receiving care.',
    example: 'You are uninsured and scheduling an MRI. You request a good faith estimate. The provider must give you a written cost estimate within 3 business days.',
    category: 'Legal Rights',
  },
  {
    term: 'HIPAA',
    definition: 'The Health Insurance Portability and Accountability Act. Protects the privacy of your medical records and information and ensures coverage continuity when changing jobs.',
    example: 'Your doctor cannot share your medical records with your employer without your written consent. That protection comes from HIPAA.',
    category: 'Legal Rights',
  },
  {
    term: 'ERISA',
    definition: 'A federal law governing employer-sponsored health plans. Allows employees to appeal denied claims. Self-funded employer plans are governed by ERISA rather than state insurance law.',
    example: 'Your employer self-funds its health plan under ERISA. You can appeal a denied claim through ERISA\'s process even if your state has different insurance rules.',
    category: 'Legal Rights',
  },
  {
    term: 'Internal Appeal',
    definition: 'The formal process of asking your own insurance company to reconsider a denied claim or coverage decision.',
    example: 'Your insurer denies coverage for a CT scan. You file an internal appeal with additional documentation from your doctor. They reverse the denial.',
    category: 'Legal Rights',
  },
  {
    term: 'External Appeal',
    definition: 'If your internal appeal is denied, you can request an independent external review by a third party not affiliated with your insurer. Their decision is usually binding.',
    example: 'Your insurer denies a life-saving treatment twice. You request an external appeal. An independent medical reviewer overturns the denial.',
    category: 'Legal Rights',
  },
  {
    term: 'Parity Law (Mental Health Parity)',
    definition: 'Federal law requiring insurers to cover mental health and substance use disorder benefits at the same level as medical and surgical benefits.',
    example: 'Your plan covers 80% of specialist visits. Under parity law, it must cover 80% of therapy visits too. You can file a complaint if it does not.',
    category: 'Legal Rights',
  },
  {
    term: 'Grievance',
    definition: 'A formal complaint you file with your insurance company about a service-related issue, such as poor customer service, billing errors, or wait times.',
    example: 'Your insurer repeatedly sent you bills for services that were covered. You file a grievance. The insurer is required to respond within a set timeframe.',
    category: 'Legal Rights',
  },
  {
    term: 'Medical Debt Protections',
    definition: 'A set of state and federal rules limiting how medical debt can be collected and reported. As of 2025, the CFPB rule bans most medical debt from credit reports.',
    example: 'A hospital sends your $500 bill to collections. Under the new CFPB rule, this debt cannot appear on your credit report and cannot affect your credit score.',
    category: 'Legal Rights',
  },
  // Documents
  {
    term: 'Summary of Benefits and Coverage (SBC)',
    definition: 'A standardized 4-page document all insurers must provide that summarizes your plan\'s key benefits, costs, and coverage limits in plain language.',
    example: 'Before choosing between two plans at work, you compare their SBCs side by side to see which has lower deductibles and better drug coverage.',
    category: 'Documents',
  },
  {
    term: 'Evidence of Coverage (EOC)',
    definition: 'A comprehensive document your insurer provides that details everything your plan covers, limits, exclusions, and your rights as a member.',
    example: 'You are unsure if your plan covers chiropractic care. You search your plan\'s EOC document to find the specific benefit and any visit limits.',
    category: 'Documents',
  },
  {
    term: 'Insurance Card',
    definition: 'The physical or digital card provided by your insurer showing your member ID, group number, plan name, and key phone numbers. Always carry it.',
    example: 'At the ER, the staff asks for your insurance card. Your member ID and group number let them bill your insurer directly.',
    category: 'Documents',
  },
  {
    term: 'Member ID Number',
    definition: 'Your unique identifier within your insurance plan. Used by providers and pharmacies to verify your coverage and submit claims.',
    example: 'The pharmacy needs your member ID to look up your drug coverage and copay. It is printed on your insurance card.',
    category: 'Documents',
  },
  {
    term: 'Group Number',
    definition: 'A number on your insurance card that identifies your employer or organization\'s insurance plan. Used to distinguish your plan from others the insurer manages.',
    example: 'You and a colleague both have the same insurer but different employers. Your group numbers are different, reflecting your separate employer plans.',
    category: 'Documents',
  },
  {
    term: 'Advance Explanation of Benefits (AEOB)',
    definition: 'A document sent before a scheduled service showing estimated costs. Required by the No Surprises Act for certain services 3 days before care.',
    example: 'You schedule a colonoscopy. Three days before, your insurer sends an AEOB estimating your cost at $180 after deductible. No surprises on the bill.',
    category: 'Documents',
  },
  {
    term: 'Certificate of Creditable Coverage',
    definition: 'A document proving you had health coverage previously. Historically used to avoid pre-existing condition waiting periods. Less critical post-ACA but still relevant for Medicare.',
    example: 'You join Medicare late but can show continuous employer coverage with a certificate. This may reduce or eliminate your late enrollment penalty.',
    category: 'Documents',
  },
  {
    term: 'HIPAA Authorization Form',
    definition: 'A form you sign to allow a specific party to access your medical records or health information for a specified purpose.',
    example: 'You authorize your specialist to share records with your PCP by signing a HIPAA authorization form. Without it, they cannot share your information.',
    category: 'Documents',
  },
  // Additional Coverage Basics
  {
    term: 'Actuarial Value',
    definition: 'The percentage of total average healthcare costs a plan pays for a standard population. Bronze is 60%, Silver 70%, Gold 80%, Platinum 90%.',
    example: 'A Silver plan has a 70% actuarial value. On average, across all members, the plan pays 70% of covered costs and members pay 30%.',
    category: 'Coverage Basics',
  },
  {
    term: 'Ambulatory Services',
    definition: 'Healthcare services that do not require an overnight hospital stay, such as outpatient surgery, lab tests, and office visits.',
    example: 'Your tonsillectomy is done as an outpatient procedure. Because you go home the same day, it is classified as an ambulatory service.',
    category: 'Coverage Basics',
  },
  {
    term: 'Durable Medical Equipment (DME)',
    definition: 'Equipment prescribed by a doctor for home use to help with a medical condition, such as wheelchairs, oxygen equipment, or CPAP machines. Often partially covered.',
    example: 'Your doctor prescribes a CPAP machine for sleep apnea. Medicare Part B covers 80% after the deductible if the equipment is medically necessary.',
    category: 'Coverage Basics',
  },
  {
    term: 'Home Health Care',
    definition: 'Skilled medical care provided in your home by nurses or therapists, usually after a hospital stay or for ongoing chronic conditions.',
    example: 'After hip replacement surgery, a physical therapist visits your home three times a week. Medicare Part A may cover this if you meet criteria.',
    category: 'Coverage Basics',
  },
  {
    term: 'Hospice Care',
    definition: 'Comfort-focused care for people expected to live 6 months or less. Prioritizes quality of life over curative treatment. Covered by Medicare Part A.',
    example: 'A terminal cancer patient chooses hospice care. Medicare covers pain management, nursing visits, and family support instead of aggressive treatments.',
    category: 'Coverage Basics',
  },
  {
    term: 'Skilled Nursing Facility (SNF)',
    definition: 'A facility providing short-term skilled nursing or rehabilitation care following a qualifying hospital stay of at least 3 days.',
    example: 'After a stroke, your doctor orders rehab at a skilled nursing facility. Medicare Part A covers the first 20 days at 100% after a qualifying hospital stay.',
    category: 'Coverage Basics',
  },
  {
    term: 'Mental Health Parity',
    definition: 'See Parity Law. Requires mental health benefits to be comparable to medical benefits in terms of treatment limits, prior auth requirements, and cost-sharing.',
    example: 'Your plan allows unlimited physical therapy visits but limits therapy to 20 sessions per year. That may violate mental health parity law.',
    category: 'Coverage Basics',
  },
  {
    term: 'Non-Participating Provider',
    definition: 'A provider who has no contract with your insurer at all, not even as an out-of-network option. Your plan may not cover any of their charges.',
    example: 'A doctor is non-participating with your insurer. Even as an out-of-network claim, your insurer declines to pay. You owe the full amount.',
    category: 'Networks',
  },
  {
    term: 'Health Savings Account (HSA)',
    definition: 'A tax-advantaged account available to people with HDHPs. You contribute pre-tax money that rolls over year to year and can be used for qualified medical expenses.',
    example: 'You contribute $3,000 to your HSA tax-free. You use $800 for prescriptions and $400 for a dental visit. The remaining $1,800 earns interest and rolls to next year.',
    category: 'Costs & Billing',
  },
  {
    term: 'Flexible Spending Account (FSA)',
    definition: 'A pre-tax account offered by employers for healthcare expenses. Unlike an HSA, most FSA funds must be used by year-end or you lose them.',
    example: 'You put $1,500 into your FSA in January. By December you have only used $900. You have until year-end to spend the remaining $600 or it is forfeited.',
    category: 'Costs & Billing',
  },
  {
    term: 'Health Reimbursement Account (HRA)',
    definition: 'An employer-funded account that reimburses you for qualified medical expenses. Unlike an HSA, only your employer contributes.',
    example: 'Your employer puts $1,000 into your HRA. You submit receipts for your copays and deductibles and get reimbursed up to that amount.',
    category: 'Costs & Billing',
  },
  {
    term: 'Medically Necessary',
    definition: 'A standard used by insurers to determine whether a service, treatment, or medication is appropriate and required for diagnosis or treatment of a condition.',
    example: 'Your insurer denies a CT scan claiming it is not medically necessary. Your doctor writes a letter of medical necessity explaining why it is needed, and the denial is reversed.',
    category: 'Costs & Billing',
  },
  {
    term: 'Adverse Benefit Determination',
    definition: 'The formal term for when your insurer denies, limits, reduces, or terminates coverage for a service. Triggers your right to appeal.',
    example: 'You receive a letter saying your inpatient stay is denied as not medically necessary. That is an adverse benefit determination. You have the right to appeal.',
    category: 'Legal Rights',
  },
  {
    term: 'Network Adequacy',
    definition: 'The requirement that insurance plans have a sufficient number of in-network providers to ensure members can actually access care in a timely manner.',
    example: 'Your HMO has only one in-network psychiatrist in your county with a 4-month wait. That may be a network adequacy violation you can report to your state.',
    category: 'Networks',
  },
]

export const CATEGORIES = Array.from(
  new Set(GLOSSARY.map((t) => t.category))
) as GlossaryCategory[]
