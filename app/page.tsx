"use client";

import { useEffect, useRef, useState } from "react";
import { youthProfiles } from "./profiles";

const pad = (value: number) => String(value).padStart(2, "0");

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const activeProfile = youthProfiles[activeIndex];

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const selectProfile = (index: number, nextDirection?: "next" | "previous") => {
    const normalized = (index + youthProfiles.length) % youthProfiles.length;
    if (normalized === activeIndex) return;
    setDirection(nextDirection || (normalized > activeIndex ? "next" : "previous"));
    setActiveIndex(normalized);
  };

  const nextProfile = () => selectProfile(activeIndex + 1, "next");
  const previousProfile = () => selectProfile(activeIndex - 1, "previous");
  const openProfile = (index: number) => {
    selectProfile(index);
    window.setTimeout(() => document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" }), 40);
  };

  const swipeHandlers = {
    onTouchStart: (event: React.TouchEvent) => {
      const touch = event.changedTouches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchEnd: (event: React.TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
        if (deltaX < 0) nextProfile();
        else previousProfile();
      }
    },
  };

  return (
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-water" aria-hidden="true" />
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="lotus lotus-hero" aria-hidden="true"><i /><b /><em /><span /></div>

        <header className="brand-bar">
          <a className="brand" href="#top" aria-label="返回页面顶部">
            <span className="brand-logo"><img src="/boc-logo.jpg" alt="" /></span>
            <span className="brand-name">
              <strong>中国银行益阳分行</strong>
              <small>BANK OF CHINA · YIYANG BRANCH</small>
            </span>
          </a>
          <span className="column-tag">青年廉洁<br />文化专栏</span>
        </header>

        <div className="hero-copy">
          <p className="eyebrow"><span>BOC YOUTH · INTEGRITY</span> 青年廉洁文化主题 H5</p>
          <h1 id="hero-title"><span>青荷</span><span>守廉</span></h1>
          <p className="hero-line">莲心守正 <i /> 清风润青</p>
          <p className="hero-intro">扣好职业生涯“第一粒扣子”，涵养清正品格，筑牢思想防线，坚守金融从业人员廉洁从业底线。</p>
          <a className="hero-action" href="#prologue">开启青廉篇章 <span aria-hidden="true">↓</span></a>
        </div>

        <div className="hero-stats" aria-label="栏目内容统计">
          <div><strong>10</strong><span>位青年员工</span></div>
          <div><strong>03</strong><span>个主题模块</span></div>
          <div><strong>01</strong><span>份清廉初心</span></div>
        </div>
      </section>

      <nav className="chapter-nav" aria-label="页面章节导航">
        <a href="#portraits"><span>01</span>照片</a>
        <a href="#intro"><span>02</span>自我介绍</a>
        <a href="#reflection"><span>03</span>岗位感悟</a>
      </nav>

      <section className="prologue section-pad" id="prologue" data-reveal>
        <div className="section-index"><span>00</span><i /></div>
        <div className="prologue-title">
          <p className="eyebrow dark">THE HEART OF LOTUS</p>
          <h2>莲心守正<br /><em>清风润青</em></h2>
        </div>
        <div className="prologue-copy">
          <p className="lead">青年是行稳致远的生力军，扣好职业生涯“第一粒扣子”至关重要。</p>
          <p>本栏目开展青年廉洁文化宣传、警示教育、风险提示，引导青年知敬畏、存戒惧、守底线，涵养清正品格，筑牢思想防线，坚守金融从业人员廉洁从业底线。</p>
          <div className="principles" aria-label="青廉准则">
            <span><b>知</b>敬畏</span><span><b>存</b>戒惧</span><span><b>守</b>底线</span>
          </div>
        </div>
      </section>

      <section className="portraits section-pad" id="portraits" aria-labelledby="portraits-title">
        <div className="section-heading light" data-reveal>
          <div className="section-index"><span>01</span><i /></div>
          <div>
            <p className="eyebrow">YOUTH PORTRAITS</p>
            <h2 id="portraits-title">青荷十人 · 青春风采</h2>
          </div>
          <p>十张青春面孔，十份岗位担当。点击照片，走近他们的清廉初心。</p>
        </div>

        <div className="portrait-grid">
          {youthProfiles.map((profile, index) => (
            <button
              type="button"
              className={`portrait-card${index === activeIndex ? " is-active" : ""}`}
              onClick={() => openProfile(index)}
              aria-label={`查看${profile.name}的自我介绍`}
              key={profile.slot}
              data-reveal
            >
              {profile.image ? (
                <img src={profile.image} alt={`${profile.name}工作照片`} style={{ objectPosition: profile.imagePosition }} />
              ) : (
                <span className="portrait-placeholder" aria-hidden="true"><i /><b /><em /></span>
              )}
              <span className="portrait-shade" />
              <span className="portrait-number">{pad(profile.slot)}</span>
              <span className="portrait-info"><strong>{profile.name}</strong><small>{profile.department}</small></span>
              <span className="portrait-keyword">{profile.keyword}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="intro-section section-pad" id="intro" aria-labelledby="intro-title">
        <div className="section-heading" data-reveal>
          <div className="section-index"><span>02</span><i /></div>
          <div>
            <p className="eyebrow dark">ABOUT ME</p>
            <h2 id="intro-title">青春名片 · 向清而行</h2>
          </div>
          <p>左右滑动或点击序号，切换青年员工档案。</p>
        </div>

        <div className="profile-tabs" role="tablist" aria-label="选择青年员工">
          {youthProfiles.map((profile, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="intro-panel"
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => selectProfile(index)}
              key={profile.slot}
            >
              <span>{pad(profile.slot)}</span><small>{profile.name}</small>
            </button>
          ))}
        </div>

        <article
          className={`profile-stage slide-${direction}`}
          id="intro-panel"
          role="tabpanel"
          tabIndex={0}
          aria-live="polite"
          aria-label={`${activeProfile.name}的自我介绍`}
          key={`intro-${activeProfile.slot}`}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") previousProfile();
            if (event.key === "ArrowRight") nextProfile();
          }}
          {...swipeHandlers}
        >
          <div className={`profile-photo photo-${activeProfile.imageLayout}`}>
            {activeProfile.image ? (
              <>
                <img className="profile-backdrop" src={activeProfile.image} alt="" aria-hidden="true" style={{ objectPosition: activeProfile.imagePosition }} />
                <img className="profile-main-photo" src={activeProfile.image} alt={`${activeProfile.name}个人照片`} style={{ objectPosition: activeProfile.imagePosition }} />
              </>
            ) : (
              <div className="profile-photo-placeholder">
                <span>NO. {pad(activeProfile.slot)}</span>
                <i aria-hidden="true"><b /><em /></i>
                <strong>照片待发布</strong>
                <small>PORTRAIT MATERIAL PENDING</small>
              </div>
            )}
            <div className="photo-meta"><span>BOC YOUTH</span><b>青荷 · {activeProfile.keyword}</b></div>
          </div>
          <div className="profile-copy">
            <div className="profile-count">YOUTH PROFILE <span>{pad(activeProfile.slot)} / 10</span></div>
            <p className="profile-kicker">清风青年 · 岗位有我</p>
            <h3>{activeProfile.name}</h3>
            <p className="profile-role">{activeProfile.department}<i />{activeProfile.role}</p>
            <div className="intro-quote"><span>自我介绍</span><p>{activeProfile.intro}</p></div>
            <a href="#reflection">阅读岗位清廉感悟 <span aria-hidden="true">↘</span></a>
          </div>
        </article>

        <div className="profile-controls">
          <button type="button" onClick={previousProfile} aria-label="上一位青年员工">← 上一位</button>
          <div><i style={{ width: `${((activeIndex + 1) / youthProfiles.length) * 100}%` }} /></div>
          <span><b>{pad(activeIndex + 1)}</b> / 10</span>
          <button type="button" onClick={nextProfile} aria-label="下一位青年员工">下一位 →</button>
        </div>
      </section>

      <section className="reflection-section section-pad" id="reflection" aria-labelledby="reflection-title">
        <div className="lotus lotus-reflection" aria-hidden="true"><i /><b /><em /><span /></div>
        <div className="section-heading light" data-reveal>
          <div className="section-index"><span>03</span><i /></div>
          <div>
            <p className="eyebrow">INTEGRITY AT WORK</p>
            <h2 id="reflection-title">清廉与岗位 · 我的感悟</h2>
          </div>
          <p>清廉不是远处的标语，而是每一次选择、每一道流程、每一个细节。</p>
        </div>

        <article className={`reflection-card slide-${direction}`} key={`reflection-${activeProfile.slot}`} {...swipeHandlers}>
          <div className="reflection-side">
            <span>{pad(activeProfile.slot)}</span>
            <div className="reflection-avatar">
              {activeProfile.image ? <img src={activeProfile.image} alt="" style={{ objectPosition: activeProfile.imagePosition }} /> : <span aria-hidden="true"><i /><b /></span>}
            </div>
            <div><strong>{activeProfile.name}</strong><small>{activeProfile.role}</small></div>
          </div>
          <div className="reflection-copy">
            <p className="reflection-label"><span>岗位关键词</span>{activeProfile.keyword}</p>
            <blockquote>“{activeProfile.reflection}”</blockquote>
            <div className="signature"><span>青年清廉寄语</span><b>{activeProfile.name}</b></div>
          </div>
        </article>

        <div className="reflection-nav" aria-label="切换岗位感悟">
          <button type="button" onClick={previousProfile} aria-label="上一位感悟">←</button>
          <div className="reflection-dots">
            {youthProfiles.map((profile, index) => (
              <button
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => selectProfile(index)}
                aria-label={`查看${profile.name}的岗位感悟`}
                aria-current={index === activeIndex ? "true" : undefined}
                key={profile.slot}
              ><span>{pad(profile.slot)}</span></button>
            ))}
          </div>
          <button type="button" onClick={nextProfile} aria-label="下一位感悟">→</button>
        </div>
      </section>

      <section className="closing section-pad" data-reveal>
        <p className="eyebrow">PURE HEART · STEADY STEPS</p>
        <div className="closing-seal">廉</div>
        <h2>以莲为鉴守初心<br /><em>以廉为帆赴未来</em></h2>
        <p>心有所畏，言有所戒，行有所止。<br />让青春在清正担当中绽放，让清风在金融一线常驻。</p>
        <a href="#top">返回首页 <span aria-hidden="true">↑</span></a>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><img src="/boc-logo.jpg" alt="" /><span><strong>中国银行益阳分行</strong><small>BANK OF CHINA · YIYANG BRANCH</small></span></div>
        <p>青年廉洁文化主题宣传 · 青荷守廉</p>
      </footer>
    </main>
  );
}
