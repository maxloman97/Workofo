import { type Locale, DEFAULT_LOCALE } from './locales';

export const INDUSTRY_SLUGS = [
  'retail',
  'warehousing-logistics',
  'hospitality-qsrs',
  'facility-management',
  'healthcare',
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

export function isIndustrySlug(value: string | undefined): value is IndustrySlug {
  return !!value && (INDUSTRY_SLUGS as readonly string[]).includes(value);
}

type Localized<T> = Record<Locale, T>;

type SolutionStat = { value: string; label: Localized<string> };
type SolutionChallenge = { title: Localized<string>; points: Localized<string[]> };
type SolutionFeature = { title: Localized<string>; body: Localized<string> };
type SolutionSection = { title: Localized<string>; intro: Localized<string>; points: Localized<string[]> };

export type IndustrySolution = {
  slug: IndustrySlug;
  navLabel: Localized<string>;
  metaTitle: Localized<string>;
  metaDescription: Localized<string>;
  eyebrow: Localized<string>;
  headline: Localized<string>;
  lede: Localized<string>;
  stats: SolutionStat[];
  challenges: SolutionChallenge[];
  features: SolutionFeature[];
  sections: SolutionSection[];
  ctaHeadline: Localized<string>;
  ctaBody: Localized<string>;
};

function loc<T>(en: T, lt: T, se: T = en): Localized<T> {
  return { en, lt, se };
}

const sharedCta = {
  headline: loc(
    'See how Workofo fits your operation',
    'Sužinokite, kaip Workofo tinka jūsų operacijoms',
  ),
  body: loc(
    'Book a tailored demo and explore AI scheduling built for your industry.',
    'Užsisakykite pritaikytą demonstraciją ir išbandykite AI grafikus savo sektoriui.',
  ),
};

export const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    slug: 'retail',
    navLabel: loc('Retail', 'Mažmena'),
    metaTitle: loc(
      'Retail Scheduling Software | AI Workforce Scheduling | Workofo',
      'Mažmenos darbo jėgos planavimas | Workofo',
    ),
    metaDescription: loc(
      'AI-powered retail scheduling that puts the right people on the floor from morning delivery to evening rush, across every store.',
      'AI mažmenos grafikai, derinantys personalą su srautu, pardavimais ir atitiktimi visose parduotuvėse.',
    ),
    eyebrow: loc('Workforce scheduling for retail', 'Mažmena'),
    headline: loc(
      'Better staffing. Stronger stores.',
      'Mažmenos grafikai, saugantys maržą ir aptarnavimą',
    ),
    lede: loc(
      'From the morning delivery to the evening rush, put the right people on the floor when your stores need them.',
      'Workofo padeda mažmenininkams suderinti darbo jėgą su paklausa parduotuvėse, skyriuose ir užsakymų vykdyme — su įmontuota atitiktimi ir 15 min. tikslumu.',
    ),
    stats: [
      { value: '5–15%', label: loc('typical labour savings', 'tipinis darbo taupymas') },
      { value: '15 min', label: loc('schedule granularity', 'grafiko detalumas') },
      { value: '100%', label: loc('rule compliance', 'taisyklių atitiktis') },
    ],
    challenges: [
      {
        title: loc('Omnichannel & fulfilment', 'Omnikanalas ir užsakymų vykdymas'),
        points: loc(
          [
            'Staff click-and-collect, ship-from-store, and back-of-house together.',
            'Balance sales floor coverage with stockroom and micro-fulfilment tasks.',
          ],
          [
            'Planuokite click-and-collect, siuntimą iš parduotuvės ir sandėlio darbus kartu.',
            'Derinkite pardavimo salės padengimą su sandėlio ir mikrovykdymo užduotimis.',
          ],
        ),
      },
      {
        title: loc('Labour shortages & turnover', 'Darbo jėgos trūkumas ir kaita'),
        points: loc(
          [
            'Forecast-driven schedules reduce burnout and last-minute gaps.',
            'Self-service shift swaps improve retention on the front line.',
          ],
          [
            'Prognozėmis pagrįsti grafikai mažina pervargimą ir paskutinės minutės spragas.',
            'Savarankiškas pamainų keitimas gerina fronto linijos išlaikymą.',
          ],
        ),
      },
      {
        title: loc('Compliance risk', 'Atitikties rizika'),
        points: loc(
          [
            'Encode union rules, rest periods, and local labour law in every schedule.',
            'Real-time alerts before violations become fines.',
          ],
          [
            'Įtraukite profsąjungų taisykles, poilsio laikus ir vietinius įstatymus į kiekvieną grafiką.',
            'Įspėjimai realiu laiku, kol pažeidimai netampa baudomis.',
          ],
        ),
      },
      {
        title: loc('ROI & customer experience', 'ROI ir klientų patirtis'),
        points: loc(
          [
            'Link labour plans to live sales and footfall signals.',
            'Put your best people on the floor during peak trading hours.',
          ],
          [
            'Siekite darbo planų su gyvais pardavimų ir srauto duomenimis.',
            'Geriausius darbuotojus planuokite piko valandomis.',
          ],
        ),
      },
    ],
    features: [
      {
        title: loc('Demand-driven scheduling', 'Paklausa pagrįsti grafikai'),
        body: loc(
          'Align shifts with sales trends, traffic, and promotional calendars.',
          'Derinkite pamainas su pardavimų tendencijomis, srautu ir akcijų kalendoriais.',
        ),
      },
      {
        title: loc('Boost conversion', 'Didinkite konversiją'),
        body: loc(
          'Schedule skilled associates when conversion matters most.',
          'Planuokite kvalifikuotus darbuotojus, kai konversija svarbiausia.',
        ),
      },
      {
        title: loc('Automated compliance', 'Automatinė atitiktis'),
        body: loc(
          'Cut admin with automated rule checks across every location.',
          'Mažinkite administravimą su automatine taisyklių kontrole visose vietose.',
        ),
      },
      {
        title: loc('Multi-site visibility', 'Daugiavietė matomumas'),
        body: loc(
          'Live view of headcount, gaps, and skills across your estate.',
          'Gyvą galvų skaičių, spragas ir įgūdžius visame tinkle.',
        ),
      },
    ],
    sections: [
      {
        title: loc('Engage store teams', 'Įtraukite parduotuvių komandas'),
        intro: loc(
          'Retention starts with predictable, fair schedules your staff can influence.',
          'Išlaikymas prasideda nuo nuspėjamų, sąžiningų grafikų, kuriuos darbuotojai gali įtakoti.',
        ),
        points: loc(
          [
            'Mobile-friendly shift views and swap requests.',
            'Fair rotation across weekends and peak periods.',
            'Fewer last-minute calls and schedule surprises.',
          ],
          [
            'Mobilios pamainų peržiūros ir keitimo užklausos.',
            'Sąžiningas rotavimas savaitgaliais ir piko laikotarpiais.',
            'Mažiau skambučių paskutinę minutę ir grafiko staigmenų.',
          ],
        ),
      },
      {
        title: loc('Compliance without friction', 'Atitiktis be trinties'),
        intro: loc(
          'Stay ahead of changing retail labour rules without slowing managers down.',
          'Laikykitės besikeičiančių mažmenos darbo taisyklių neapsunkindami vadovų.',
        ),
        points: loc(
          [
            'Configurable rules for contracts, minors, and rest breaks.',
            'Audit-ready schedules for labour inspections.',
            'Transparent labour cost tracking by store and department.',
          ],
          [
            'Konfigūruojamos sutarčių, nepilnamečių ir poilsio taisyklės.',
            'Auditui paruošti grafikai darbo inspekcijoms.',
            'Skaidri darbo sąnaudų apskaita pagal parduotuvę ir skyrių.',
          ],
        ),
      },
      {
        title: loc('Forecast demand, control cost', 'Prognozuokite paklausą, kontroliuokite sąnaudas'),
        intro: loc(
          'Get staffing right every week with AI that learns your store patterns.',
          'Teisingai planuokite personalą kiekvieną savaitę su AI, mokosi jūsų parduotuvių modelių.',
        ),
        points: loc(
          [
            'Forecasts from historical sales, tasks, and events.',
            'Reduce overtime while protecting service levels.',
            'Dynamic allocation across formats and fulfilment hubs.',
          ],
          [
            'Prognozės iš istorinių pardavimų, užduočių ir įvykių.',
            'Mažinkite viršvalandžius saugodami aptarnavimo lygį.',
            'Dinaminis paskirstymas formatais ir vykdymo centrais.',
          ],
        ),
      },
    ],
    ctaHeadline: sharedCta.headline,
    ctaBody: sharedCta.body,
  },
  {
    slug: 'warehousing-logistics',
    navLabel: loc('Warehousing & Logistics', 'Sandėliavimas ir logistika'),
    metaTitle: loc('Warehouse & logistics scheduling | Workofo', 'Sandėlio ir logistikos grafikai | Workofo'),
    metaDescription: loc(
      'Optimize warehouse and logistics labour across shifts, zones, and throughput peaks.',
      'Optimizuokite sandėlio ir logistikos darbo jėgą pamainose, zonose ir pralaidumo pikuose.',
    ),
    eyebrow: loc('Warehousing & Logistics', 'Sandėliavimas ir logistika'),
    headline: loc(
      'Warehouse scheduling built for throughput and safety',
      'Sandėlio grafikai pralaidumui ir saugai',
    ),
    lede: loc(
      'Match pickers, packers, and yard teams to inbound waves and outbound cut-offs, with skills, certifications, and labour rules built in.',
      'Derinkite rinkėjus, pakuotojus ir kiemo komandas su įeinančiomis bangomis ir išvykimo terminais — su įgūdžiais, sertifikatais ir darbo taisyklėmis.',
    ),
    stats: [
      { value: '5–15%', label: loc('labour efficiency gains', 'darbo efektyvumo augimas') },
      { value: '24/7', label: loc('shift coverage', 'pamainų padengimas') },
      { value: 'Skills', label: loc('matched to zones', 'derinami su zonomis') },
    ],
    challenges: [
      {
        title: loc('Volume volatility', 'Apimties svyravimai'),
        points: loc(
          ['Scale labour with inbound/outbound peaks and seasonality.', 'Avoid idle time between wave releases.'],
          ['Masteliuokite darbo jėgą su įeinančiais/išeinančiais pikais ir sezoniškumu.', 'Venkite prastovos tarp bangų.'],
        ),
      },
      {
        title: loc('Skills & certifications', 'Įgūdžiai ir sertifikatai'),
        points: loc(
          ['Schedule MHE operators, cold-chain, and hazmat-trained staff correctly.', 'Never assign uncertified workers to restricted zones.'],
          ['Teisingai planuokite MHE operatorius, šaltos grandinės ir pavojingų krovinių darbuotojus.', 'Nepriskirkite nesertifikuotų darbuotojų ribotoms zonoms.'],
        ),
      },
      {
        title: loc('Shift handovers', 'Pamainų perdavimai'),
        points: loc(
          ['Smooth transitions between day, swing, and night crews.', 'Balance fatigue rules across consecutive shifts.'],
          ['Sklandūs perėjimai tarp dienos, vakaro ir nakties pamainų.', 'Derinkite nuovargio taisykles per iš eilės pamainas.'],
        ),
      },
      {
        title: loc('Cost per unit', 'Sąnaudos vienam vienetui'),
        points: loc(
          ['Tie labour hours to picks, pallets, and SLA windows.', 'Cut overtime without missing dispatch deadlines.'],
          ['Susiekite darbo valandas su rinkimais, padėklais ir SLA langais.', 'Mažinkite viršvalandžius nepraleisdami išsiuntimo terminų.'],
        ),
      },
    ],
    features: [
      {
        title: loc('Wave-based planning', 'Bangomis pagrįstas planavimas'),
        body: loc('Staff to inbound ASN and outbound dispatch schedules.', 'Planuokite pagal įeinančius ASN ir išsiuntimo grafikus.'),
      },
      {
        title: loc('Zone & role matching', 'Zonų ir vaidmenų derinimas'),
        body: loc('Put certified operators on the right equipment and aisles.', 'Sertifikuotus operatorius — ant tinkamos technikos ir praėjimų.'),
      },
      {
        title: loc('Fatigue & compliance', 'Nuovargis ir atitiktis'),
        body: loc('Encode rest rules, max hours, and consecutive shift limits.', 'Įtraukite poilsio, maks. valandų ir iš eilės pamainų taisykles.'),
      },
      {
        title: loc('Multi-site labour pool', 'Daugiavietis darbo fondas'),
        body: loc('Share flex workers across hubs when volume spikes.', 'Dalinkitės lankstais darbuotojais tarp hubų, kai apimtis šoka.'),
      },
    ],
    sections: [
      {
        title: loc('Throughput without burnout', 'Pralaidumas be pervargimo'),
        intro: loc('Keep pick rates high with schedules that respect recovery time.', 'Išlaikykite rinkimo tempą su grafikais, gerbiančiais atsigavimą.'),
        points: loc(
          ['Fair rotation across heavy and light zones.', 'Predictable rosters reduce absenteeism.', 'Mobile shift visibility for floor supervisors.'],
          ['Sąžiningas rotavimas sunkiose ir lengvose zonose.', 'Nuspėjami grafikai mažina neatvykimus.', 'Mobili pamainų matomumas salės vadovams.'],
        ),
      },
      {
        title: loc('Safety-first scheduling', 'Saugumas pirmiausia'),
        intro: loc('Compliance is not optional in high-risk environments.', 'Atitiktis neprivaloma rizikingose aplinkose.'),
        points: loc(
          ['Certification tracking on every assignment.', 'Automated alerts for rule conflicts.', 'Audit trails for labour inspections.'],
          ['Sertifikatų sekimas kiekvienam priskyrimui.', 'Automatiniai įspėjimai dėl taisyklių konfliktų.', 'Audito pėdsakai darbo inspekcijoms.'],
        ),
      },
      {
        title: loc('Forecast labour to volume', 'Prognozuokite darbo jėgą pagal apimtį'),
        intro: loc('AI learns your facility rhythms: promotions, weather, and carrier cut-offs.', 'AI mokosi jūsų objekto ritmų — akcijų, oro ir vežėjų terminų.'),
        points: loc(
          ['Plan headcount to expected lines and pallets.', 'Reduce agency spend with better core scheduling.', 'Align temps with certified shift gaps only.'],
          ['Planuokite personalą pagal numatomas eilutes ir padėklus.', 'Mažinkite agentūrų išlaidas geresniais pagrindiniais grafikais.', 'Derinkite laikiną personalą tik su sertifikuotomis spragomis.'],
        ),
      },
    ],
    ctaHeadline: sharedCta.headline,
    ctaBody: sharedCta.body,
  },
  {
    slug: 'hospitality-qsrs',
    navLabel: loc('Hospitality & QSRs', 'Svetingumas ir greitas maistas'),
    metaTitle: loc('Hospitality & QSR scheduling | Workofo', 'Svetingumo ir QSR grafikai | Workofo'),
    metaDescription: loc(
      'Schedule restaurants, hotels, and QSR teams to demand, from rushes to events.',
      'Planuokite restoranų, viešbučių ir QSR komandas pagal paklausą — nuo piko iki renginių.',
    ),
    eyebrow: loc('Hospitality & QSRs', 'Svetingumas ir QSR'),
    headline: loc(
      'Hospitality scheduling for every rush and every guest',
      'Svetingumo grafikai kiekvienam pikui ir svečiui',
    ),
    lede: loc(
      'From breakfast rushes to late-night service, Workofo aligns FOH, BOH, and events staff with real demand, while keeping labour rules and preferences fair.',
      'Nuo pusryčių piko iki vėlyvo aptarnavimo — Workofo derina salės, virtuvės ir renginių personalą su realia paklausa, išlaikydamas sąžiningas taisykles.',
    ),
    stats: [
      { value: '5–15%', label: loc('labour cost reduction', 'darbo sąnaudų mažinimas') },
      { value: 'FOH + BOH', label: loc('unified planning', 'vieningas planavimas') },
      { value: 'Fair', label: loc('shift preferences', 'pamainų pageidavimai') },
    ],
    challenges: [
      {
        title: loc('Unpredictable demand', 'Nenuspėjama paklausa'),
        points: loc(
          ['Weather, events, and holidays swing covers overnight.', 'Avoid overstaffing quiet periods and understaffing rushes.'],
          ['Oras, renginiai ir šventės keičia padengimą per naktį.', 'Venkite perviršinio personalo ramiais laikotarpiais ir trūkumo piko metu.'],
        ),
      },
      {
        title: loc('High turnover', 'Didelė kaita'),
        points: loc(
          ['Flexible swaps and predictable rosters improve retention.', 'Onboard faster with templated shift patterns.'],
          ['Lankstus keitimas ir nuspėjami grafikai gerina išlaikymą.', 'Greitesnis įvedimas su šabloniais pamainų modeliais.'],
        ),
      },
      {
        title: loc('Split roles & skills', 'Skaidomi vaidmenys ir įgūdžiai'),
        points: loc(
          ['Balance bar, kitchen, and floor skills every service.', 'Schedule certified food-safety leads on every close.'],
          ['Derinkite baro, virtuvės ir salės įgūdžius kiekvieną pamainą.', 'Planuokite sertifikuotus maisto saugos vadovus kiekvienam uždarymui.'],
        ),
      },
      {
        title: loc('Thin margins', 'Mažos maržos'),
        points: loc(
          ['Tie labour to covers, tickets, and delivery volume.', 'Protect guest experience without overspending on labour.'],
          ['Susiekite darbo jėgą su užsakymais, čekiais ir pristatymo apimtimi.', 'Saugokite svečių patirtį nepervirškindami darbo sąnaudų.'],
        ),
      },
    ],
    features: [
      {
        title: loc('Rush-ready forecasts', 'Pikui paruoštos prognozės'),
        body: loc('Staff to historical covers, events, and local calendars.', 'Planuokite pagal istorinius užsakymus, renginius ir kalendorius.'),
      },
      {
        title: loc('FOH / BOH alignment', 'Salės ir virtuvės derinimas'),
        body: loc('One plan for service, kitchen, and support roles.', 'Vienas planas aptarnavimui, virtuvei ir pagalbiniams vaidmenims.'),
      },
      {
        title: loc('Employee-friendly rosters', 'Darbuotojams patogūs grafikai'),
        body: loc('Preferences, availability, and fair weekend rotation.', 'Pageidavimai, prieinamumas ir sąžiningas savaitgalio rotavimas.'),
      },
      {
        title: loc('Multi-venue control', 'Kelių vietų kontrolė'),
        body: loc('Consistent standards across sites, brands, and franchises.', 'Vienodi standartai vietose, prekės ženkluose ir franšizėse.'),
      },
    ],
    sections: [
      {
        title: loc('Delight guests, support staff', 'Džiuginkite svečius, palaikykite personalą'),
        intro: loc('Great service starts with schedules people can trust.', 'Puikus aptarnavimas prasideda nuo grafikų, kuriais darbuotojai gali pasitikėti.'),
        points: loc(
          ['Self-service shift swaps reduce manager firefighting.', 'Push updates when service times change.', 'Recognition-friendly stable teams on busy services.'],
          ['Savarankiškas pamainų keitimas mažina vadovų gesinimą.', 'Pranešimai, kai keičiasi aptarnavimo laikai.', 'Stabilios komandos užimtoms pamainoms.'],
        ),
      },
      {
        title: loc('Labour law & tipping rules', 'Darbo teisė ir arbatpinigių taisyklės'),
        intro: loc('Complex hospitality regulations handled in the scheduling engine.', 'Sudėtingos svetingumo taisyklės grafikų variklyje.'),
        points: loc(
          ['Breaks, splits, and minor-hour rules automated.', 'Regional compliance templates out of the box.', 'Transparent records for audits.'],
          ['Automatizuotos pertraukos, skaidymas ir nepilnamečių valandos.', 'Regioniniai atitikties šablonai.', 'Skaidrūs įrašai auditams.'],
        ),
      },
      {
        title: loc('Plan to the plate', 'Planuokite iki lėkštės'),
        intro: loc('Connect scheduling to reservations, delivery, and events.', 'Sujunkite grafikus su rezervacijomis, pristatymu ir renginiais.'),
        points: loc(
          ['Adjust labour when bookings or delivery spikes.', 'Event staffing without last-minute chaos.', 'Reduce food waste from misaligned prep teams.'],
          ['Koreguokite personalą, kai šoka rezervacijos ar pristatymas.', 'Renginių personalas be paskutinės minutės chaoso.', 'Mažinkite maisto švaistymą dėl netinkamai suderintų komandų.'],
        ),
      },
    ],
    ctaHeadline: sharedCta.headline,
    ctaBody: sharedCta.body,
  },
  {
    slug: 'facility-management',
    navLabel: loc('Facility Management', 'Pastatų valdymas'),
    metaTitle: loc('Facility management scheduling | Workofo', 'Pastatų valdymo grafikai | Workofo'),
    metaDescription: loc(
      'Schedule cleaners, technicians, and security across buildings, contracts, and SLAs.',
      'Planuokite valytojus, technikus ir apsaugą pastatuose, sutartyse ir SLA.',
    ),
    eyebrow: loc('Facility Management', 'Pastatų valdymas'),
    headline: loc(
      'Facility scheduling that meets every SLA',
      'Pastatų grafikai, atitinkantys kiekvieną SLA',
    ),
    lede: loc(
      'Coordinate mobile teams across sites and contracts, matching skills, travel time, and service windows while keeping labour costs predictable.',
      'Koordinuokite mobilias komandas vietose ir sutartyse — derindami įgūdžius, kelionės laiką ir aptarnavimo langus.',
    ),
    stats: [
      { value: 'Multi-site', label: loc('contract coverage', 'sutarčių padengimas') },
      { value: 'SLA', label: loc('window tracking', 'langų sekimas') },
      { value: 'Skills', label: loc('based dispatch', 'paskirstymas pagal įgūdžius') },
    ],
    challenges: [
      {
        title: loc('Distributed workforce', 'Išdėstytas personalas'),
        points: loc(
          ['Technicians and cleaners move between buildings daily.', 'Travel time must be part of every feasible plan.'],
          ['Technikai ir valytojai kasdien juda tarp pastatų.', 'Kelionės laikas turi būti kiekvieno plano dalis.'],
        ),
      },
      {
        title: loc('Contract complexity', 'Sutarčių sudėtingumas'),
        points: loc(
          ['Different SLAs, frequencies, and skill mixes per client.', 'One missed window risks penalties or churn.'],
          ['Skirtingi SLA, dažnumai ir įgūdžiai kiekvienam klientui.', 'Vienas praleistas langas — baudos ar praradimo rizika.'],
        ),
      },
      {
        title: loc('Reactive maintenance', 'Reaktyvus priežiūra'),
        points: loc(
          ['Balance planned routes with emergency call-outs.', 'Reprioritise without breaking compliance.'],
          ['Derinkite planuotus maršrutus su skubiais iškvietimais.', 'Perprioritetizuokite nepažeisdami atitikties.'],
        ),
      },
      {
        title: loc('Thin contract margins', 'Mažos sutarčių maržos'),
        points: loc(
          ['Optimise labour hours per site visit.', 'Reduce overtime on multi-building days.'],
          ['Optimizuokite darbo valandas vienam apsilankymui.', 'Mažinkite viršvalandžius dienose su keliais pastatais.'],
        ),
      },
    ],
    features: [
      {
        title: loc('Route-aware planning', 'Maršrutais pagrįstas planavimas'),
        body: loc('Schedules that respect travel and handover time.', 'Grafikai, gerbiantys kelionę ir perdavimo laiką.'),
      },
      {
        title: loc('Contract templates', 'Sutarčių šablonai'),
        body: loc('Reusable patterns per client, site, and service type.', 'Pakartotini modeliai klientui, vietai ir paslaugos tipui.'),
      },
      {
        title: loc('Skills & clearance', 'Įgūdžiai ir leidimai'),
        body: loc('Match HVAC, electrical, and security certs to tasks.', 'Derinkite HVAC, elektros ir apsaugos sertifikatus užduotims.'),
      },
      {
        title: loc('Live re-planning', 'Gyvasis perplanavimas'),
        body: loc('Adjust rosters when jobs run long or priorities shift.', 'Koreguokite grafikus, kai darbai užtrunka ar keičiasi prioritetai.'),
      },
    ],
    sections: [
      {
        title: loc('Deliver on every contract', 'Vykdykite kiekvieną sutartį'),
        intro: loc('Visibility across clients, buildings, and service tiers.', 'Matomumas klientų, pastatų ir paslaugų lygių lygiu.'),
        points: loc(
          ['See coverage gaps before clients do.', 'Standardise quality across dispersed teams.', 'Report labour vs. contract hours accurately.'],
          ['Matykite spragas, kol jų nepastebi klientai.', 'Standartizuokite kokybę išsibarsčiusiose komandose.', 'Tiksliai ataskaitinkite darbo valandas vs. sutartį.'],
        ),
      },
      {
        title: loc('Empower field teams', 'Įgalinkite lauko komandas'),
        intro: loc('Mobile-first schedules for staff on the move.', 'Mobiliai pirmiausia grafikai judantiems darbuotojams.'),
        points: loc(
          ['Clear daily run sheets on any device.', 'Swap shifts within qualification rules.', 'Fewer calls back to the office for changes.'],
          ['Aiškūs dienos lapai bet kuriame įrenginyje.', 'Keiskite pamainas pagal kvalifikacijos taisykles.', 'Mažiau skambučių biurui dėl pakeitimų.'],
        ),
      },
      {
        title: loc('Optimise labour per visit', 'Optimizuokite darbą vienam apsilankymui'),
        intro: loc('Right-size crews for each task list and SLA window.', 'Tinkamo dydžio brigados kiekvienam užduočių sąrašui ir SLA langui.'),
        points: loc(
          ['Forecast hours from historical job data.', 'Reduce idle time between site visits.', 'Protect margin on fixed-price contracts.'],
          ['Prognozuokite valandas iš istorinių darbų duomenų.', 'Mažinkite prastovą tarp apsilankymų.', 'Saugokite maržą fiksuotos kainos sutartyse.'],
        ),
      },
    ],
    ctaHeadline: sharedCta.headline,
    ctaBody: sharedCta.body,
  },
  {
    slug: 'healthcare',
    navLabel: loc('Healthcare', 'Sveikatos apsauga'),
    metaTitle: loc('Healthcare workforce scheduling | Workofo', 'Sveikatos apsaugos grafikai | Workofo'),
    metaDescription: loc(
      'Clinical and care scheduling with compliance, skill mix, and patient demand built in.',
      'Klinikinis ir priežiūros planavimas su atitiktimi, įgūdžių deriniu ir pacientų paklausa.',
    ),
    eyebrow: loc('Healthcare', 'Sveikatos apsauga'),
    headline: loc(
      'Healthcare scheduling that protects care quality',
      'Sveikatos apsaugos grafikai, saugantys priežiūros kokybę',
    ),
    lede: loc(
      'Plan nurses, carers, and support staff to patient acuity and ward demand, with mandatory rest, skill mix, and regulatory rules enforced automatically.',
      'Planuokite slaugytojus, globėjus ir pagalbinį personalą pagal pacientų sudėtingumą ir skyriaus paklausą — su privalomu poilsiu, įgūdžių deriniu ir reguliavimo taisyklėmis.',
    ),
    stats: [
      { value: 'Skill mix', label: loc('on every shift', 'kiekvienoje pamainoje') },
      { value: '24/7', label: loc('ward coverage', 'skyriaus padengimas') },
      { value: 'Compliant', label: loc('rest & hours', 'poilsis ir valandos') },
    ],
    challenges: [
      {
        title: loc('Acuity & demand', 'Sudėtingumas ir paklausa'),
        points: loc(
          ['Patient volumes and acuity change shift by shift.', 'Staff to census and care intensity, not static ratios.'],
          ['Pacientų apimtys ir sudėtingumas keičiasi pamaina po pamainos.', 'Planuokite pagal cenzą ir priežiūros intensyvumą, ne statinius koeficientus.'],
        ),
      },
      {
        title: loc('Burnout & shortages', 'Pervargimas ir trūkumas'),
        points: loc(
          ['Fair rotation reduces consecutive long shifts.', 'Fill gaps without relying on unsafe overtime.'],
          ['Sąžiningas rotavimas mažina iš eilės ilgas pamainas.', 'Užpildykite spragas be nesaugaus viršvalandžių.'],
        ),
      },
      {
        title: loc('Regulatory compliance', 'Reguliavimo atitiktis'),
        points: loc(
          ['Rest periods, max hours, and qualification rules on every roster.', 'Audit-ready records for inspections.'],
          ['Poilsio laikai, maks. valandos ir kvalifikacijos kiekvienam grafikui.', 'Auditui paruošti įrašai inspekcijoms.'],
        ),
      },
      {
        title: loc('Multi-disciplinary teams', 'Daugiadisciplinės komandos'),
        points: loc(
          ['Balance RNs, HCAs, specialists, and support roles.', 'Never schedule below minimum skill coverage.'],
          ['Derinkite slaugytojus, pagalbininkus, specialistus ir pagalbinius vaidmenis.', 'Niekada neplanuokite žemiau minimalaus įgūdžių padengimo.'],
        ),
      },
    ],
    features: [
      {
        title: loc('Acuity-based staffing', 'Sudėtingumu pagrįstas personalas'),
        body: loc('Align headcount to patient need and ward activity.', 'Derinkite personalą su pacientų poreikiu ir skyriaus veikla.'),
      },
      {
        title: loc('Skill & qualification rules', 'Įgūdžių ir kvalifikacijos taisyklės'),
        body: loc('Right credentials on every shift, every unit.', 'Teisingi sertifikatai kiekvienoje pamainoje, kiekviename skyriuje.'),
      },
      {
        title: loc('Fair rosters', 'Sąžiningi grafikai'),
        body: loc('Transparent rotation for nights, weekends, and holidays.', 'Skaidrus rotavimas naktims, savaitgaliais ir šventėmis.'),
      },
      {
        title: loc('Bank & agency fill', 'Rezervinis ir agentūrinis užpildymas'),
        body: loc('Call in flex staff only where certified gaps exist.', 'Kvieskite lankstų personalą tik ten, kur yra sertifikuotų spragų.'),
      },
    ],
    sections: [
      {
        title: loc('Support clinicians, not admin', 'Palaikykite klinikiečius, ne administraciją'),
        intro: loc('Give ward managers time back with automated scheduling.', 'Grąžinkite skyriaus vadovams laiką su automatizuotais grafikais.'),
        points: loc(
          ['Fewer hours building and re-building rosters.', 'Self-service swaps within clinical rules.', 'Real-time view of gaps before handover.'],
          ['Mažiau valandų grafikams kurti ir perkurti.', 'Savarankiškas keitimas pagal klinikines taisykles.', 'Gyvą spragų vaizdą prieš perdavimą.'],
        ),
      },
      {
        title: loc('Compliance by design', 'Atitiktis pagal dizainą'),
        intro: loc('Healthcare regulations encoded once, applied everywhere.', 'Sveikatos apsaugos taisyklės užkoduotos vieną kartą, taikomos visur.'),
        points: loc(
          ['Mandatory rest and max-hour enforcement.', 'Role ratios and supervision rules built in.', 'Exportable audit logs for regulators.'],
          ['Privalomo poilsio ir maks. valandų vykdymas.', 'Vaidmenų koeficientai ir priežiūros taisyklės.', 'Eksportuojami audito žurnalai reguliuotojams.'],
        ),
      },
      {
        title: loc('Plan to patient demand', 'Planuokite pagal pacientų paklausą'),
        intro: loc('Forecasts from historical census, seasonality, and local patterns.', 'Prognozės iš istorinės censo, sezoniškumo ir vietinių modelių.'),
        points: loc(
          ['Reduce agency spend with better core cover.', 'Protect quality on high-acuity days.', 'Align elective and emergency capacity.'],
          ['Mažinkite agentūrų išlaidas geresniu pagrindiniu padengimu.', 'Saugokite kokybę didelio sudėtingumo dienomis.', 'Derinkite planinę ir skubią pajėgumą.'],
        ),
      },
    ],
    ctaHeadline: sharedCta.headline,
    ctaBody: sharedCta.body,
  },
];

const solutionBySlug = new Map(INDUSTRY_SOLUTIONS.map((s) => [s.slug, s]));

export function getIndustrySolution(slug: IndustrySlug): IndustrySolution | undefined {
  return solutionBySlug.get(slug);
}

export function listIndustrySolutions(): IndustrySolution[] {
  return INDUSTRY_SOLUTIONS;
}

function pick<T>(localized: Localized<T>, locale: Locale): T {
  return localized[locale] ?? localized[DEFAULT_LOCALE];
}

export type ResolvedIndustrySolution = {
  slug: IndustrySlug;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  lede: string;
  stats: Array<{ value: string; label: string }>;
  challenges: Array<{ title: string; points: string[] }>;
  features: Array<{ title: string; body: string }>;
  sections: Array<{ title: string; intro: string; points: string[] }>;
  ctaHeadline: string;
  ctaBody: string;
};

export function resolveIndustrySolution(slug: IndustrySlug, locale: Locale): ResolvedIndustrySolution {
  const solution = getIndustrySolution(slug);
  if (!solution) throw new Error(`Unknown industry: ${slug}`);

  return {
    slug: solution.slug,
    navLabel: pick(solution.navLabel, locale),
    metaTitle: pick(solution.metaTitle, locale),
    metaDescription: pick(solution.metaDescription, locale),
    eyebrow: pick(solution.eyebrow, locale),
    headline: pick(solution.headline, locale),
    lede: pick(solution.lede, locale),
    stats: solution.stats.map((s) => ({ value: s.value, label: pick(s.label, locale) })),
    challenges: solution.challenges.map((c) => ({
      title: pick(c.title, locale),
      points: pick(c.points, locale),
    })),
    features: solution.features.map((f) => ({
      title: pick(f.title, locale),
      body: pick(f.body, locale),
    })),
    sections: solution.sections.map((s) => ({
      title: pick(s.title, locale),
      intro: pick(s.intro, locale),
      points: pick(s.points, locale),
    })),
    ctaHeadline: pick(solution.ctaHeadline, locale),
    ctaBody: pick(solution.ctaBody, locale),
  };
}
