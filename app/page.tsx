"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Student = { name: string; className: string; school: string };
type Screen = "welcome" | "hub" | "station1" | "station2";
type PlanTab = "home" | "school" | "route";

const emptyStudent: Student = { name: "", className: "", school: "" };

const quizQuestions = [
  {
    type: "صح أم خطأ",
    text: "يوجد بين كل اتجاهين أصليين اتجاه فرعي.",
    options: ["صح", "خطأ"],
    correct: 0,
    note: "صحيح، مثل الشمال الشرقي بين الشمال والشرق.",
  },
  {
    type: "صح أم خطأ",
    text: "تُستخدم النجوم لتحديد الاتجاهات أثناء النهار.",
    options: ["صح", "خطأ"],
    correct: 1,
    note: "نستخدم النجوم ليلًا، ونستخدم الشمس نهارًا.",
  },
  {
    type: "اختاري",
    text: "عند مواجهة الشمس وقت الشروق، أي اتجاه يكون على يسارك؟",
    options: ["الجنوب", "الشمال", "الغرب"],
    correct: 1,
    note: "أمامك الشرق، وخلفك الغرب، ويسارك الشمال.",
  },
  {
    type: "اختاري",
    text: "الأداة التي تحدد الاتجاهات بسرعة ودقة في الهاتف هي...",
    options: ["النجم القطبي", "الخريطة", "البوصلة الرقمية"],
    correct: 2,
    note: "البوصلة الرقمية موجودة في الهواتف الذكية.",
  },
  {
    type: "صح أم خطأ",
    text: "يقتصر اختيار الطريق المناسب على السرعة فقط.",
    options: ["صح", "خطأ"],
    correct: 1,
    note: "نراعي السرعة والهدف والسهولة وحالة الطريق.",
  },
  {
    type: "صح أم خطأ",
    text: "يشير النجم القطبي الشمالي دائمًا إلى اتجاه الشمال.",
    options: ["صح", "خطأ"],
    correct: 0,
    note: "صحيح، ولذلك استخدمه المصريون القدماء لتحديد الاتجاهات ليلًا.",
  },
  {
    type: "اختاري",
    text: "من المسؤول عن تصميم وبناء المنازل والمدارس؟",
    options: ["الطبيب", "المهندس", "المعلم"],
    correct: 1,
    note: "المهندس يصمم المنازل والمدارس والمباني.",
  },
  {
    type: "اختاري",
    text: "الاتجاه الفرعي بين الجنوب والغرب هو...",
    options: ["الشمال الغربي", "الجنوب الشرقي", "الجنوب الغربي"],
    correct: 2,
    note: "الجنوب الغربي يقع بين اتجاهي الجنوب والغرب.",
  },
  {
    type: "صح أم خطأ",
    text: "رسم النوافذ والأبواب في المخطط يسمح بتوضيح دخول الهواء وضوء الشمس.",
    options: ["صح", "خطأ"],
    correct: 0,
    note: "صحيح، لذلك لا ننسى الأبواب والنوافذ عند رسم مخطط المنزل.",
  },
  {
    type: "اختاري",
    text: "المكان الذي نتعلم فيه ويضم غرف دراسة ومكتبة وملعبًا هو...",
    options: ["المنزل", "المدرسة", "السوق"],
    correct: 1,
    note: "المدرسة بيتنا الثاني ومكان التعلم والأنشطة.",
  },
];

const matchItems = [
  { id: "star", label: "النجم القطبي", correct: "الشمال" },
  { id: "sun", label: "الشمس عند الشروق", correct: "الشرق" },
  { id: "behind", label: "خلفنا عند مواجهة الشروق", correct: "الغرب" },
  { id: "right", label: "يميننا عند مواجهة الشروق", correct: "الجنوب" },
];

export default function Home() {
  const [student, setStudent] = useState<Student>(emptyStudent);
  const [screen, setScreen] = useState<Screen>("welcome");
  const [planTab, setPlanTab] = useState<PlanTab>("home");
  const [warmupAnswer, setWarmupAnswer] = useState<string | null>(null);
  const [routeAnswer, setRouteAnswer] = useState<string | null>(null);
  const [directionFocus, setDirectionFocus] = useState("الشمال");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = localStorage.getItem("directions-student");
      if (!stored) return;
      try { setStudent(JSON.parse(stored)); } catch { /* ignore invalid local data */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updateField(field: keyof Student, value: string) {
    setStudent((current) => ({ ...current, [field]: value }));
  }

  function startLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!student.name.trim() || !student.className.trim()) return;
    localStorage.setItem("directions-student", JSON.stringify(student));
    setScreen("hub");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goTo(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const score = useMemo(() => {
    const quizScore = quizQuestions.reduce(
      (sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0),
      0,
    );
    const matchScore = matchItems.reduce(
      (sum, item) => sum + (matches[item.id] === item.correct ? 1 : 0),
      0,
    );
    return quizScore + matchScore;
  }, [answers, matches]);

  if (screen === "welcome") {
    return (
      <main className="welcome-page" dir="rtl">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="sparkles" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span><span>✧</span></div>

        <section className="welcome-content" aria-labelledby="lesson-title">
          <div className="lesson-heading">
            <span className="unit-pill">الوحدة الأولى · اتجاهاتنا ترسم خطواتنا</span>
            <h1 id="lesson-title"><span>الدرس الأول</span>الأماكن والاتجاهات من حولنا</h1>
            <p className="teacher-name">إعداد المعلمة <strong>شهد زهران</strong></p>
          </div>

          <form className="student-card" onSubmit={startLesson}>
            <div className="card-glow" aria-hidden="true" />
            <div className="card-title">
              <span className="compass-mark" aria-hidden="true">✥</span>
              <div><p>بطاقة المستكشفة</p><h2>اكتبي بياناتك يا جميلة</h2></div>
            </div>
            <label><span>اسم الطالبة</span><input value={student.name} onChange={(e) => updateField("name", e.target.value)} placeholder="اكتبي اسمك هنا" autoComplete="name" required /></label>
            <div className="field-row">
              <label><span>الصف / الفصل</span><input value={student.className} onChange={(e) => updateField("className", e.target.value)} placeholder="مثال: ٤ / أ" required /></label>
              <label><span>المدرسة <small>اختياري</small></span><input value={student.school} onChange={(e) => updateField("school", e.target.value)} placeholder="اسم المدرسة" /></label>
            </div>
            <button className="start-button" type="submit"><span>ابدئي رحلة الاتجاهات</span><b aria-hidden="true">←</b></button>
            <p className="privacy-note">بياناتك محفوظة على جهازك فقط</p>
          </form>
        </section>
        <div className="lesson-badge" aria-hidden="true"><span>٢</span><small>محطتان ممتعتان</small></div>
      </main>
    );
  }

  return (
    <main className="app-page" dir="rtl">
      <header className="app-header">
        <button className="brand" type="button" onClick={() => goTo("hub")} aria-label="العودة إلى الرئيسية">
          <span>✥</span><div><b>بوصلة شهد</b><small>الأماكن والاتجاهات</small></div>
        </button>
        <nav aria-label="محطات الدرس">
          <button className={screen === "station1" ? "active" : ""} onClick={() => goTo("station1")}>١ · خرائطنا</button>
          <button className={screen === "station2" ? "active" : ""} onClick={() => goTo("station2")}>٢ · بوصلة المستكشفة</button>
        </nav>
        <button className="student-chip" type="button" onClick={() => goTo("welcome")} title="تعديل البيانات">
          <span>{student.name.trim().slice(0, 1) || "ط"}</span><div><b>{student.name || "طالبتنا"}</b><small>{student.className || "الصف الرابع"}</small></div>
        </button>
      </header>

      {screen === "hub" && <Hub student={student} goTo={goTo} />}
      {screen === "station1" && (
        <StationOne
          planTab={planTab}
          setPlanTab={setPlanTab}
          warmupAnswer={warmupAnswer}
          setWarmupAnswer={setWarmupAnswer}
          routeAnswer={routeAnswer}
          setRouteAnswer={setRouteAnswer}
          goTo={goTo}
        />
      )}
      {screen === "station2" && (
        <StationTwo
          directionFocus={directionFocus}
          setDirectionFocus={setDirectionFocus}
          answers={answers}
          setAnswers={setAnswers}
          matches={matches}
          setMatches={setMatches}
          showResult={showResult}
          setShowResult={setShowResult}
          score={score}
          student={student}
          goTo={goTo}
        />
      )}
    </main>
  );
}

function Hub({ student, goTo }: { student: Student; goTo: (screen: Screen) => void }) {
  return (
    <div className="hub-page">
      <section className="hub-intro">
        <div>
          <span className="eyebrow">رحلة مصممة لكِ</span>
          <h1>أهلًا يا <em>{student.name || "مستكشفتنا"}</em> ✨</h1>
          <p>محطتان فاخرتان تأخذانك من قراءة المخططات إلى إتقان البوصلة والاتجاهات.</p>
        </div>
        <div className="journey-progress"><span>٠٪</span><div><i /></div><small>ابدئي بالمحطة الأولى</small></div>
      </section>

      <section className="station-grid" aria-label="محطات الدرس">
        <article className="station-card station-card-one">
          <img src="/station-maps.png" alt="طالبتان تستكشفان نموذجي المنزل والمدرسة" />
          <div className="station-overlay" />
          <div className="station-copy">
            <span className="station-number">المحطة ١</span>
            <h2>خرائطنا الجميلة</h2>
            <p>تهيئة سريعة، مخطط المنزل والمدرسة، ثم نختار الطريق الأنسب.</p>
            <ul><li>٣ مشاهد تعليمية</li><li>تفاعل واكتشاف</li></ul>
            <button onClick={() => goTo("station1")}>ابدئي المحطة <b>←</b></button>
          </div>
        </article>

        <article className="station-card station-card-two">
          <img src="/station-directions.png" alt="طالبة تستخدم الشمس والبوصلة لمعرفة الاتجاهات" />
          <div className="station-overlay" />
          <div className="station-copy">
            <span className="station-number">المحطة ٢</span>
            <h2>بوصلة المستكشفة</h2>
            <p>الشمس والنجوم والبوصلة، ثم أسئلة وتدريبات تفاعلية متنوعة.</p>
            <ul><li>شرح بصري كامل</li><li>١٤ نقطة تقييم</li></ul>
            <button onClick={() => goTo("station2")}>استكشفي الاتجاهات <b>←</b></button>
          </div>
        </article>
      </section>
      <p className="demo-note"><span>✦</span> نسخة عرض تجريبية فاخرة · المحطتان تمثلان تجربة التطبيق الكاملة</p>
    </div>
  );
}

function StationOne({ planTab, setPlanTab, warmupAnswer, setWarmupAnswer, routeAnswer, setRouteAnswer, goTo }: {
  planTab: PlanTab; setPlanTab: (tab: PlanTab) => void; warmupAnswer: string | null; setWarmupAnswer: (value: string) => void;
  routeAnswer: string | null; setRouteAnswer: (value: string) => void; goTo: (screen: Screen) => void;
}) {
  return (
    <div className="station-page">
      <section className="station-hero compact-hero maps-hero">
        <img src="/station-maps.png" alt="نموذجان ثلاثيا الأبعاد لمخططي منزل ومدرسة" />
        <div className="station-hero-copy"><span>المحطة الأولى</span><h1>خرائطنا الجميلة</h1><p>نرى المكان من الأعلى، نفهم تفاصيله، ثم نختار أفضل طريق للوصول.</p></div>
      </section>

      <section className="content-block warmup-block">
        <div className="section-title"><span>تهيئة</span><h2>ماذا ترين من الأعلى؟</h2><p>اختاري الإجابة التي تصف المخطط بصورة صحيحة.</p></div>
        <div className="warmup-question">
          <div className="mini-plan" aria-hidden="true"><span>غرفة نوم</span><span>استقبال</span><span>مطبخ</span><span>حمام</span></div>
          <div><h3>المخطط هو...</h3><div className="choice-row">
            <button className={warmupAnswer === "above" ? "selected" : ""} onClick={() => setWarmupAnswer("above")}>رسم مصغر للمكان من الأعلى</button>
            <button className={warmupAnswer === "front" ? "wrong selected" : ""} onClick={() => setWarmupAnswer("front")}>صورة للمكان من الأمام فقط</button>
          </div>{warmupAnswer && <p className={warmupAnswer === "above" ? "feedback good" : "feedback bad"}>{warmupAnswer === "above" ? "رائعة! المخطط يوضح تفاصيل المكان كأننا نراه من الأعلى." : "حاولي مرة أخرى؛ فكري كيف نرى الغرف كلها في وقت واحد."}</p>}</div>
        </div>
      </section>

      <section className="content-block lesson-tabs-block">
        <div className="section-title"><span>شرح واكتشاف</span><h2>ثلاثة مشاهد في محطة واحدة</h2></div>
        <div className="lesson-tabs" role="tablist">
          <button className={planTab === "home" ? "active" : ""} onClick={() => setPlanTab("home")}>⌂ مخطط المنزل</button>
          <button className={planTab === "school" ? "active" : ""} onClick={() => setPlanTab("school")}>▦ مخطط المدرسة</button>
          <button className={planTab === "route" ? "active" : ""} onClick={() => setPlanTab("route")}>↝ اختيار الطريق</button>
        </div>

        {planTab === "home" && <HomePlan />}
        {planTab === "school" && <SchoolPlan />}
        {planTab === "route" && <RouteLesson routeAnswer={routeAnswer} setRouteAnswer={setRouteAnswer} />}
      </section>

      <section className="takeaway-strip"><span>خلاصة المحطة</span><p>المخطط يصف المكان بوضوح من الأعلى، والطريق الأفضل يتغير حسب <b>السرعة والهدف والسهولة</b>.</p><button onClick={() => goTo("station2")}>المحطة الثانية ←</button></section>
    </div>
  );
}

function HomePlan() {
  return (
    <div className="lesson-panel">
      <div className="diagram-card"><div className="home-plan"><span className="room bedroom">غرفة نوم</span><span className="room living">غرفة استقبال</span><span className="room kitchen">مطبخ</span><span className="room bath">حمام</span><span className="room balcony">شرفة</span></div><small>مخطط منزل مبسط</small></div>
      <div className="explain-copy"><span className="concept-tag">المفهوم الأساسي</span><h3>نرسم المنزل كأننا نراه من أعلى</h3><p>يساعد المخطط على معرفة الغرف وأحجامها والعلاقة بينها بصورة أوضح من الوصف بالكلمات.</p><div className="gold-list"><p><i>١</i> نقسم المنزل ونكتب اسم كل مكان.</p><p><i>٢</i> نرسم الأبواب والنوافذ لدخول الهواء وضوء الشمس.</p><p><i>٣</i> نرسم الشمس خارج المخطط لتحديد الاتجاهات.</p></div><aside><b>من يصمم المنزل؟</b><span>المهندس هو المسؤول عن تصميم وبناء المنازل والمدارس.</span></aside></div>
    </div>
  );
}

function SchoolPlan() {
  return (
    <div className="lesson-panel">
      <div className="diagram-card"><div className="school-plan"><span className="classrooms">غرف الدراسة</span><span className="library">المكتبة</span><span className="yard">الفناء</span><span className="playground">الملعب</span><span className="garden">الحديقة</span><span className="admin">الإدارة</span></div><small>مخطط مدرسة مبسط</small></div>
      <div className="explain-copy"><span className="concept-tag">بيتنا الثاني</span><h3>مخطط المدرسة يعرّفنا بأماكنها</h3><p>نستخدمه لنعرف مواقع غرف الدراسة والمكتبة والمسرح والملعب والحديقة وغرفة الأمن ومخرج الطوارئ.</p><div className="info-grid"><div><b>٦</b><span>غرف دراسة</span></div><div><b>١</b><span>ملعب كبير</span></div><div><b>♥</b><span>مكان نتعلم فيه</span></div></div><aside><b>واجبي تجاه مدرستي</b><span>أحافظ على نظافتها وممتلكاتها كما أحافظ على بيتي.</span></aside></div>
    </div>
  );
}

function RouteLesson({ routeAnswer, setRouteAnswer }: { routeAnswer: string | null; setRouteAnswer: (value: string) => void }) {
  const routes = [
    { id: "shop", title: "الطريق الأول", meta: "٦٥٠م · ٣ معالم", text: "به منحنيات ومتاجر", icon: "⌁" },
    { id: "fast", title: "الطريق الثاني", meta: "٥٠٠م · معلم واحد", text: "طريق مباشر وسريع", icon: "→" },
    { id: "walk", title: "الطريق الثالث", meta: "١٠٠٠م · ٤ معالم", text: "طويل وبه إصلاحات", icon: "↝" },
  ];
  return (
    <div className="route-panel"><div className="route-intro"><h3>اختاري طريقك حسب الهدف</h3><p>تريد شهد الوصول إلى الحديقة بسرعة. أي طريق تختار؟</p></div><div className="route-cards">{routes.map((route) => <button key={route.id} className={routeAnswer === route.id ? "selected" : ""} onClick={() => setRouteAnswer(route.id)}><i>{route.icon}</i><b>{route.title}</b><span>{route.meta}</span><small>{route.text}</small></button>)}</div>{routeAnswer && <p className={routeAnswer === "fast" ? "feedback good" : "feedback bad"}>{routeAnswer === "fast" ? "اختيار ممتاز! الطريق الثاني هو الأقصر والمباشر." : "هذا الطريق مناسب لهدف آخر؛ للوصول سريعًا اختاري الأقصر والمباشر."}</p>}<div className="route-rule"><b>تذكري</b><span>اختيار الطريق لا يعتمد على السرعة فقط، بل على الهدف والسهولة وحالة الطريق.</span></div></div>
  );
}

function StationTwo({ directionFocus, setDirectionFocus, answers, setAnswers, matches, setMatches, showResult, setShowResult, score, student, goTo }: {
  directionFocus: string; setDirectionFocus: (value: string) => void; answers: Record<number, number>; setAnswers: (value: Record<number, number>) => void;
  matches: Record<string, string>; setMatches: (value: Record<string, string>) => void; showResult: boolean; setShowResult: (value: boolean) => void;
  score: number; student: Student; goTo: (screen: Screen) => void;
}) {
  const complete = Object.keys(answers).length === quizQuestions.length && Object.keys(matches).length === matchItems.length;
  return (
    <div className="station-page">
      <section className="station-hero compact-hero directions-hero"><img src="/station-directions.png" alt="طالبة تستخدم البوصلة في ضوء شروق الشمس" /><div className="station-hero-copy"><span>المحطة الثانية</span><h1>بوصلة المستكشفة</h1><p>نحدد الاتجاهات بالطبيعة والأدوات، ثم نختبر مهاراتنا.</p></div></section>

      <section className="content-block methods-block"><div className="section-title"><span>شرح بصري كامل</span><h2>كيف عرف الإنسان الاتجاهات؟</h2><p>استخدم الإنسان الطبيعة قديمًا، ثم استعان بالأدوات التقليدية والرقمية.</p></div><div className="method-cards"><article><i>☀</i><h3>الشمس نهارًا</h3><p>عند مواجهة الشروق: الشرق أمامنا، الغرب خلفنا، الشمال يسارنا والجنوب يميننا.</p><b>الشمس تشرق من الشرق كل صباح.</b></article><article><i>✦</i><h3>النجم القطبي ليلًا</h3><p>نجم لامع يشير دائمًا إلى الشمال، واستعان به المصريون القدماء لبراعتهم في علم الفلك.</p><b>تحديد الشمال يساعدنا على معرفة البقية.</b></article><article><i>✥</i><h3>البوصلة التقليدية</h3><p>أداة تحتوي على إبرة مغناطيسية تشير دائمًا إلى اتجاه الشمال المغناطيسي.</p><b>من الشمال نحدد بقية الاتجاهات.</b></article><article><i>⌾</i><h3>البوصلة الرقمية</h3><p>توجد في الهواتف الذكية، وتساعدنا على تحديد الاتجاهات بسرعة ودقة أكبر.</p><b>أداة حديثة سهلة الاستخدام.</b></article></div></section>

      <section className="content-block compass-block"><div className="section-title"><span>تفاعل</span><h2>اكتشفي الاتجاهات الأصلية والفرعية</h2><p>اضغطي على أي اتجاه ليظهر موقعه.</p></div><div className="compass-learning"><div className="compass-rose" aria-label="وردة الاتجاهات"><button className="north" onClick={() => setDirectionFocus("الشمال")}>شمال</button><button className="ne" onClick={() => setDirectionFocus("الشمال الشرقي")}>شمال شرقي</button><button className="east" onClick={() => setDirectionFocus("الشرق")}>شرق</button><button className="se" onClick={() => setDirectionFocus("الجنوب الشرقي")}>جنوب شرقي</button><button className="south" onClick={() => setDirectionFocus("الجنوب")}>جنوب</button><button className="sw" onClick={() => setDirectionFocus("الجنوب الغربي")}>جنوب غربي</button><button className="west" onClick={() => setDirectionFocus("الغرب")}>غرب</button><button className="nw" onClick={() => setDirectionFocus("الشمال الغربي")}>شمال غربي</button><div className="compass-center">✥<small>{directionFocus}</small></div></div><div className="direction-note"><span>الاتجاه المختار</span><h3>{directionFocus}</h3><p>{["الشمال", "الجنوب", "الشرق", "الغرب"].includes(directionFocus) ? "هذا اتجاه أصلي، وهو واحد من أربعة اتجاهات أساسية." : "هذا اتجاه فرعي يقع بين اتجاهين أصليين."}</p><div className="direction-chips"><b>الأصلية ٤</b><b>الفرعية ٤</b></div></div></div></section>

      <section className="content-block surroundings-block"><div className="section-title"><span>تطبيق على الاتجاهات</span><h2>أماكن حول الحديقة</h2><p>اقرئي مواقع الأماكن بالنسبة للحديقة، ثم استخدميها في التدريب.</p></div><div className="places-compass"><div className="place p-n">⌂<b>المنزل</b><small>شمال</small></div><div className="place p-ne">♜<b>المسجد</b><small>شمال شرقي</small></div><div className="place p-e">▦<b>المدرسة</b><small>شرق</small></div><div className="place p-se">✚<b>المستشفى</b><small>جنوب شرقي</small></div><div className="place p-s">◇<b>السوق</b><small>جنوب</small></div><div className="place p-sw">▣<b>محطة الحافلات</b><small>جنوب غربي</small></div><div className="place p-w">△<b>المتحف</b><small>غرب</small></div><div className="place p-nw">♢<b>الكنيسة</b><small>شمال غربي</small></div><div className="garden-center">♧<b>الحديقة</b><small>نقطة البداية</small></div></div></section>

      <section className="content-block qa-block"><div className="section-title"><span>بطاقات الأسئلة المجابة</span><h2>اضغطي على السؤال لتكشفي إجابته</h2><p>مراجعة شاملة لأهم تعريفات الدرس وأسئلة «بم تفسر» و«دلل».</p></div><div className="qa-grid"><details><summary>ما المقصود بالمخطط؟</summary><p>رسم مصغر للمكان كأننا نراه من الأعلى، يساعدنا على معرفة تفاصيله بصورة أوضح من الكلمات.</p></details><details><summary>لماذا نرسم الأبواب والنوافذ في مخطط المنزل؟</summary><p>لتوضيح أماكنها والسماح بدخول الهواء وضوء الشمس إلى المنزل.</p></details><details><summary>لماذا نرسم الشمس خارج المخطط؟</summary><p>للاستعانة بها في تحديد اتجاهات الأماكن داخل المخطط.</p></details><details><summary>على أي عوامل يعتمد اختيار الطريق؟</summary><p>يعتمد على السرعة والهدف والسهولة وحالة الطريق والمعالم الموجودة فيه.</p></details><details><summary>ما المقصود بالبوصلة؟</summary><p>أداة تحتوي على إبرة مغناطيسية تشير دائمًا إلى اتجاه الشمال المغناطيسي.</p></details><details><summary>ما أهمية النجم القطبي الشمالي؟</summary><p>يحدد اتجاه الشمال ليلًا، ومن خلاله نستطيع تحديد بقية الاتجاهات.</p></details><details><summary>دللي على براعة المصريين القدماء في علم الفلك.</summary><p>استعانوا بالنجم القطبي الشمالي لتحديد الاتجاهات ليلًا.</p></details><details><summary>كيف نحدد الاتجاهات بالشمس؟</summary><p>عند مواجهة الشمس وقت الشروق يكون الشرق أمامنا، والغرب خلفنا، والشمال يسارنا، والجنوب يميننا.</p></details><details><summary>ما الاتجاهات الأصلية؟</summary><p>أربعة اتجاهات هي: الشمال والجنوب والشرق والغرب.</p></details><details><summary>ما الاتجاهات الفرعية؟</summary><p>الشمال الشرقي، والجنوب الشرقي، والجنوب الغربي، والشمال الغربي.</p></details><details><summary>ما أهمية البوصلة الرقمية؟</summary><p>تحدد الاتجاهات من خلال الهاتف الذكي بسرعة ودقة أكبر.</p></details><details><summary>ما واجبنا تجاه المدرسة؟</summary><p>نحافظ على نظافتها وممتلكاتها؛ فهي بيتنا الثاني ومكان تعلمنا.</p></details></div></section>

      <section className="content-block quiz-block"><div className="section-title"><span>التدريبات</span><h2>تحدي خبيرة الاتجاهات</h2><p>صح أو خطأ، اختيار من متعدد، ثم توصيل.</p></div><div className="quiz-layout"><div className="quiz-questions">{quizQuestions.map((question, index) => <article className="quiz-card" key={question.text}><span>{question.type} · {index + 1}</span><h3>{question.text}</h3><div className="answer-buttons">{question.options.map((option, optionIndex) => <button key={option} className={answers[index] === optionIndex ? (optionIndex === question.correct ? "correct" : "incorrect") : ""} onClick={() => setAnswers({ ...answers, [index]: optionIndex })}>{option}</button>)}</div>{answers[index] !== undefined && <p className={answers[index] === question.correct ? "mini-feedback good" : "mini-feedback bad"}>{question.note}</p>}</article>)}</div><div className="matching-card"><span className="match-pill">توصيل</span><h3>صِلي كل دليل بالاتجاه الصحيح</h3>{matchItems.map((item) => <label key={item.id}><b>{item.label}</b><span>←</span><select value={matches[item.id] || ""} onChange={(e) => setMatches({ ...matches, [item.id]: e.target.value })}><option value="">اختاري الاتجاه</option><option>الشمال</option><option>الشرق</option><option>الغرب</option><option>الجنوب</option></select></label>)}<button className="result-button" disabled={!complete} onClick={() => setShowResult(true)}>شاهدي النتيجة</button><small>{complete ? "أصبحتِ جاهزة للنتيجة" : "أكملي جميع الإجابات أولًا"}</small></div></div>

        {showResult && <div className="result-card"><div className="result-medal">✦</div><span>أحسنتِ يا {student.name || "بطلتنا"}</span><h3>{score.toLocaleString("ar-EG")} / ١٤</h3><p>{score >= 12 ? "أداء رائع! أنتِ خبيرة الاتجاهات." : score >= 8 ? "أداء جميل، راجعي البطاقات وحاولي مرة أخرى." : "بداية جيدة؛ عودي للشرح ثم أعيدي التحدي."}</p><div><button onClick={() => { setAnswers({}); setMatches({}); setShowResult(false); }}>إعادة التدريب</button><button onClick={() => goTo("hub")}>العودة للمحطات</button></div></div>}
      </section>
    </div>
  );
}
