# Festival Booking Outreach

Schedule: Every Monday at 3:00 PM America/Chicago

## Required outcome and run procedure

The manager needs new booking opportunities she can act on. Reissuing the same leads with a new date or revised artist credentials is not a successful run.

1. Read the automation memory, `tasks/festival-outreach/delivery-history.json`, and prior dated research records before researching. Festival outreach sent by the user and packets delivered to Joanna are separate states.
2. Research at least 15 distinct candidates not previously delivered to Joanna, across at least three countries and both the Americas and Europe. Deepen contact research for at least five plausible candidates. These are research requirements, not inclusion quotas: never relax qualification to reach a count. If access or a depleted candidate pool prevents this coverage, record the shortfall and specific blocker honestly.
3. Record every screened candidate in `tasks/festival-outreach/YYYY-MM-DD.json`: stable festival-edition ID, outcome (`qualified`, `excluded`, or `blocked`), reason, source URLs, and the next check needed for blocked targets. Preserve these records between runs. Do not repeatedly investigate a known exclusion without new evidence or a new edition.
4. Recheck previously delivered, still-unsent targets. Keep every target that still qualifies, clearly marked RETAINED and placed after new opportunities. Record why any target no longer qualifies; never silently drop it.
5. For each included entry record current-run evidence for edition/lineup, public-application checks, contact/role, and previous programming. Each evidence object must contain `checkedAt`, a factual `finding`, and `urls`. An old memory entry or a search snippet alone is not verification; read the supporting pages and resolve conflicts.
6. Build with `node scripts/generate-festival-outreach-pdf.mjs`. The generator reads only the current America/Chicago dated JSON, validates it against delivery history, and rejects stale evidence or a packet with no new opportunity or verified contact change. Never bypass this check, rename IDs, clear history, or rewrite contact titles to manufacture novelty. A title formatting change is not a contact change.
7. Run `node --test scripts/festival-outreach-*.test.mjs`. Render and inspect every PDF page, extract the text, check the emails and links, and verify that every lead has an appropriate professional route. Test success alone does not verify research or PDF layout.
8. Before Gmail send, re-read delivery history and search the connected account's SENT messages for this run's subject/recipient. If already sent, verify that attachment and reconcile history without resending. If a send result is ambiguous, search/read back before retrying. Only send the exact PDF that passed review.
9. After successful Gmail read-back, append the delivery date, message ID, PDF SHA-256, and each included entry's stable ID/contact/email to `delivery-history.json`. Save the run outcome, unresolved research and next discovery directions in automation memory with the current run time. Commit and push the scoped changes.

If no new qualified opportunity or verified contact route emerges, save the research and report the result to the user. Do not email Joanna another unchanged packet. This rule supersedes the former requirement to generate and email a PDF on every run. Do not label a repeat-only run complete research unless the coverage above was actually performed.

Use the existing dated JSON as the schema example. Each entry also requires `festival`, `location`, `contact`, `email`, `subject`, `body`, `priority` (numeric string), `action`, and `fit`. The generator derives NEW/CONTACT UPDATED/RETAINED from delivery history. A changed email recipient additionally requires `contactChange` explaining the source-supported improvement. Renaming a decision-maker at the same inbox is conservatively treated as RETAINED, not sufficient reason to send a packet. The generator also rejects a run date with an existing delivery receipt. Keep confirmed-sent IDs synchronized with the list below only when the user explicitly reports a send.

Find House/EDM/electronic music festivals in the United States and internationally that would be a credible booking fit for Habeeb and that meet ALL of these conditions at the time of the run:

1. The festival has not announced its official artist lineup for the relevant upcoming edition.
2. There is no public official artist/DJ application or open-call submission process for that edition.
3. The user has not explicitly stated that outreach for that exact festival edition was SENT.

## Sent-status rule

A festival is considered contacted/completed ONLY when the user explicitly states that the email/outreach was sent.

Merely researching it, drafting it, putting it in a PDF, generating a manager packet, or recommending it does NOT count as sent.

Unless the user explicitly says outreach was sent, continue including that festival/edition in future runs if it still otherwise qualifies.

If the user says a batch was sent, mark only the clearly identified festivals/editions in that batch as sent.

## Explicitly sent / completed outreach

Exclude these exact editions from future outreach unless there is a new festival edition or the user explicitly asks to revisit them:

- Project GLOW 2027
- Movement Detroit 2027
- Dirtybird Campout x Northern Nights 2027
- DGTL Amsterdam 2027
- Time Warp Germany 2027
- Kappa FuturFestival 2027
- Extrema Outdoor Belgium 2027
- Loveland Festival 2027
- Lost Village 2027
- Paradise City Festival 2027
- Forbidden Forest 2027

Marvellous Island Festival 2027, Horst Arts & Music Festival 2027, and Monegros Desert Festival 2027 have NOT been reported sent. Continue including them while they still qualify.

## Festival fit

Heavily prioritize festivals whose programming fits:

- Tech House
- House
- UK Garage / UK Speed Garage
- Bassline
- Bass House
- Adjacent club and festival electronic music

Prefer established festivals and meaningful stages over low-quality or irrelevant events.

## Contact research standard

Go at least one level deeper than the festival's general contact page.

For every qualifying festival, identify the actual person or team responsible for talent booking/programming whenever reasonably discoverable, such as:

- Talent buyer
- Senior talent buyer
- Festival programmer
- Booking director
- Promoter principal
- Head of music
- Equivalent booking/programming decision-maker

Verify that person's current role using authoritative and current sources.

Then locate a legitimate professional contact route using this preference order:

1. Verified direct work email
2. Verified booking/talent/programming department inbox
3. Verified promoter/company inbox explicitly addressed to the named decision-maker

Never guess or synthesize an email address.

If the correct booking decision-maker or legitimate routing contact cannot be established with reasonable confidence, do not draft outreach for that festival and do not include it in the PDF.

For every included festival, research its official current and previous artist programming before drafting. Identify one or two relevant artists the festival has previously booked, using official festival archives, lineups, or other authoritative sources. Use those names as plain text in the email to show a specific programming connection, and never invent a booking, edition, stage, or relationship.

## Qualification verification

For every festival, verify from current public sources that:

- The relevant upcoming edition's official artist lineup is still unannounced.
- There is no official public artist/DJ application or open call for that edition.

If either condition cannot be verified, do not include the festival.

For a negative application check, review the official home, lineup, FAQ, contact, participation pages and available official announcements, plus targeted artist/DJ submission searches. State the scope as "No public artist/DJ application found on the reviewed sources as of [date]" rather than claiming exhaustive proof. An announced future application window counts as a public process even before it opens. A no-submissions policy does not make a general inbox a valid booking route: resolve the actual stage/promoter contact. General enquiries are acceptable for a named decision-maker only when not restricted to ticketing, press, emergencies or an express no-pitch policy.

## PDF deliverable

Create a clean, forwardable MANAGER OUTREACH PACKET as a PDF when the delivery check passes.

Use `scripts/generate-festival-outreach-pdf.mjs` as the only PDF writer. The generator must validate that at least one complete, send-ready entry exists before touching the dated output and must replace the final file only after a temporary PDF is written successfully. Do not add another generator that targets the same output filename.

The filename must include the generation date in `YYYY-MM-DD` format:

`Habeeb_Manager_Outreach_YYYY-MM-DD.pdf`

Display the generation date prominently near the title inside the PDF.

Start with a manager action queue: label each entry NEW, CONTACT UPDATED or RETAINED; name the recipient, explain fit and any practical limitation, and give a specific next action. New opportunities come first. Include concise linked verification notes outside the outreach copy so Joanna can check dates, contacts and qualification. Do not imply a general routing inbox is a direct personal contact or that an early booking request guarantees an available slot.

Include EVERY still-unsent qualifying festival from prior runs plus any newly discovered qualifying festivals.

Do not drop an unsent festival merely because it appeared in an earlier packet.

The PDF must contain only real, send-ready outreach. Do not include:

- Contact-research-incomplete targets
- Placeholder contacts
- Unverified email addresses
- Research-only targets

## Festival entry format

For each festival, use:

### Festival: [festival name]

Booking contact: [person's name and current role]

Email: [verified recipient email or verified routing inbox]

Subject: [concise subject]

Email copy:

[complete email body, ready for Joanna to copy into email]

Attachments: Technical Rider; Hospitality & Accommodation Rider

Then move to the next festival.

## Email style

Write each outreach as Joanna Biehler, Habeeb's manager at Night Method Agency.

Before finalizing any outreach copy, apply the `unslop` skill with its warm preset. Keep the language natural, specific, and direct without adding hype or generic praise.

Write every email dynamically for the specific festival, edition, stage mix, market, and named contact. Do not reuse a fixed template with only the festival name swapped in. The opening, programming reference, credential selection, and booking ask should reflect the research for that target.

Keep each email approximately 120-180 words and comfortable to read on a phone.

Address the named talent buyer or programmer directly whenever known.

Include one specific sentence demonstrating familiarity with that festival's programming, identity, market, stage mix, or musical direction and why Habeeb fits.

Include a second specific programming connection when useful by referencing one or two relevant artists the festival has previously booked. Verify each reference during the current run. Keep the artist names in plain text and use them to explain Habeeb's fit, not as a list of borrowed credibility.

Every outreach email must mention all four mandatory credits: Breakaway Dallas 2026, Breakaway Houston 2026, opening for James Kennedy, and opening/support for Benjamin Lloyd. Do not omit any of these to meet the word limit; shorten other copy instead.

End with a simple booking-consideration ask.

Avoid:

- Hype
- Generic compliments
- Long biographies
- Bullet-heavy resumes
- Mail-merge language
- Raw research notes

## Linking standard

Embed only one link inside each outreach:

[Habeeb EPK](https://nightmethodagency.com/habeeb)

Do not hyperlink:

- Festivals
- Venues
- Showcases
- Artists Habeeb has performed with
- Artists Habeeb is booked to perform with

Mention those names as plain text only.

## Performance history

NEVER reference Silo Dallas or any Silo performance. Habeeb has not played there.

Position Habeeb as a House / Tech House artist with an experimental edge whose sets are dynamic performances. Do not describe him as genre-fluid.

Mandatory credits for every future outreach email:

- Breakaway Dallas 2026
- Breakaway Houston 2026
- Opening for James Kennedy
- Opening/support for Benjamin Lloyd

Keep completion status accurate. As last confirmed, Breakaway Dallas 2026 and James Kennedy support are completed; Breakaway Houston 2026 and Benjamin Lloyd support are upcoming. Recheck current context each run and change upcoming wording to completed only when confirmed. Do not invent a year for either support appearance.

Optional additional credentials, only when relevant and space permits:

- Green Light Social / Sunset Sessions in Dallas
- Vice Park
- Friends Only
- Upcoming Animarum Label Showcase in Berlin in spring 2027

Clearly describe upcoming performances as upcoming rather than completed.

The four mandatory credits must appear in every draft. Use optional credentials selectively based on the target festival. Before generating the PDF, check every body for all four credits and the correct status; do not send a packet with an omission.

## Release history

Habeeb has independent releases including:

- “Money on My Mind”
- “Stick Together”

Habeeb has also signed two records to Animarum.

The two Animarum label releases are scheduled for September 18. Before September 18, describe them as signed records with releases scheduled for September 18. After September 18, describe them as released only when current context confirms that the releases are available.

Never invent:

- Release titles
- Release dates
- Chart positions
- Artist support
- Statistics

## Riders

Authoritative Hospitality & Accommodation Rider:

https://drive.google.com/file/d/1oYFH10goAWn8_OMTnEqaA_B8NL8lpG7c/view?usp=drivesdk

Authoritative Technical Rider:

https://drive.google.com/file/d/1lwhqvSyc11QnNS1SVUs-W8tvsg3UWTYK/view?usp=drivesdk

Inside each festival entry, simply write:

`Attachments: Technical Rider; Hospitality & Accommodation Rider`

Do not claim the riders are attached to the individual outreach emails.

## Gmail delivery

After creating the final PDF, send it from the connected Gmail account for `habeeb@hooshmandenterprises.com` to:

`joanna@nightmethodagency.com`

Subject:

`Habeeb Festival Outreach Packet - YYYY-MM-DD`

Use the current America/Chicago run date.

Keep the Gmail body brief. Name the new opportunities and explain what Joanna should do first. State the new/updated/retained counts and any material routing limitation. An apology or a changed PDF date is not actionable content.

Attach the generated PDF itself.

Send the email directly. Do not create a draft.

Resolve and use the Gmail connector's current `link_id` for `habeeb@hooshmandenterprises.com`. Never invent or repurpose a campaign/run identifier as the Gmail `link_id`.

If Gmail sending or attachment upload fails, explicitly report the failure in the task result and still provide the PDF download link.

## Version control

After every run, commit the festival-outreach task changes, generator and tests, and dated PDF, then push the current branch. Do not include research scratch files or unrelated workspace changes.

## Discovery priority

Prioritize novelty in discovery. Retain previously found unsent qualifying festivals in the research record and in packets that pass the delivery check. Prior inclusion never means contacted. If no useful change occurs, preserve the queue without emailing it again. Rotate markets, promoters and stage partners based on prior research instead of repeatedly searching the same festival names.
