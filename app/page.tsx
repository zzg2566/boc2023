"use client";

/* The tab panel deliberately supports keyboard arrows and touch swipes. */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { useEffect, useRef, useState } from "react";
import { youthProfiles } from "./profiles";

const pad = (value: number) => String(value).padStart(2, "0");

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const tabList = tabsRef.current;
    const activeTab = tabList?.querySelector<HTMLElement>("button.is-active");
    if (!tabList || !activeTab || tabList.scrollWidth <= tabList.clientWidth) return;

    const target = activeTab.offsetLeft - (tabList.clientWidth - activeTab.offsetWidth) / 2;
    const maximum = tabList.scrollWidth - tabList.clientWidth;
    tabList.scrollTo({ left: Math.max(0, Math.min(target, maximum)), behavior: "smooth" });
  }, [activeIndex]);

  const selectProfile = (index: number, nextDirection?: "next" | "previous") => {
    const normalized = (index + youthProfiles.length) % youthProfiles.length;
    if (normalized === activeIndex) return;
    setDirection(nextDirection || (normalized > activeIndex ? "next" : "previous"));
    setActiveIndex(normalized);
  };

  const nextProfile = () => selectProfile(activeIndex + 1, "next");
  const previousProfile = () => selectProfile(activeIndex - 1, "previous");

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
            <span className="brand-logo"><img src="/boc-logo.png" alt="" /></span>
            <span className="brand-name">
              <strong>中国银行益阳分行</strong>
              <small>BANK OF CHINA · YIYANG BRANCH</small>
            </span>
          </a>
          <span className="column-tag">青年廉洁<br />文化专栏</span>
        </header>

        <div className="hero-copy">
          <p className="eyebrow hero-kicker"><span>BOC YOUTH · INTEGRITY</span><strong>2023届青年员工廉洁感悟分享专栏</strong></p>
          <h1 id="hero-title"><span>青荷</span><span>守廉</span></h1>
          <p className="hero-line">莲心守正 <i /> 清风润青</p>
          <p className="hero-intro">扣好职业生涯“第一粒扣子”，涵养清正品格，筑牢思想防线，坚守金融从业人员廉洁从业底线。</p>
          <a className="hero-action" href="#prologue">开启青廉篇章 <span aria-hidden="true">↓</span></a>
        </div>

        <div className="hero-stats" aria-label="栏目内容统计">
          <div><strong>10</strong><span>位青年员工</span></div>
          <div><strong>03</strong><span>模块合一</span></div>
          <div><strong>01</strong><span>份清廉初心</span></div>
        </div>
      </section>

      <nav className="chapter-nav" aria-label="页面内容导航">
        <a href="#profile-photo"><span>01</span>员工照片</a>
        <a href="#profile-intro"><span>02</span>自我介绍</a>
        <a href="#profile-reflection"><span>03</span>岗位感悟</a>
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

      <section className="profiles-section section-pad" id="profiles" aria-labelledby="profiles-title">
        <div className="lotus lotus-profiles" aria-hidden="true"><i /><b /><em /><span /></div>
        <div className="section-heading light" data-reveal>
          <div className="section-index"><span>01–03</span><i /></div>
          <div>
            <p className="eyebrow">YOUTH INTEGRITY FILE</p>
            <h2 id="profiles-title">一人一页 · 三章合一</h2>
          </div>
          <p>照片、自我介绍、岗位清廉感悟集中展示；点击序号或左右滑动即可切换员工。</p>
        </div>

        <div className="profile-tabs compact-tabs" role="tablist" aria-label="选择青年员工" ref={tabsRef}>
          {youthProfiles.map((profile, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="profile-panel"
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => selectProfile(index)}
              key={profile.slot}
            >
              <span>{pad(profile.slot)}</span><small>{profile.name}</small>
            </button>
          ))}
        </div>

        <article
          className={`merged-profile slide-${direction}`}
          id="profile-panel"
          role="tabpanel"
          tabIndex={0}
          aria-live="polite"
          aria-label={`${activeProfile.name}的完整档案`}
          key={activeProfile.slot}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") previousProfile();
            if (event.key === "ArrowRight") nextProfile();
          }}
          {...swipeHandlers}
        >
          <div className={`merged-photo photo-${activeProfile.imageLayout}`} id="profile-photo">
            {activeProfile.image ? (
              <>
                <img className="profile-backdrop" src={activeProfile.image} alt="" aria-hidden="true" style={{ objectPosition: activeProfile.imagePosition }} />
                <img className="profile-main-photo" src={activeProfile.image} alt={`${activeProfile.name}个人照片`} style={{ objectPosition: activeProfile.imagePosition }} />
              </>
            ) : (
              <div className="profile-photo-placeholder">
                <span>MODULE 01 · PHOTO / NO. {pad(activeProfile.slot)}</span>
                <i aria-hidden="true"><b /><em /></i>
                <strong>照片待发布</strong>
                <small>PORTRAIT MATERIAL PENDING</small>
              </div>
            )}
            <div className="photo-meta"><span>BOC YOUTH</span><b>青荷 · {activeProfile.keyword}</b></div>
          </div>

          <div className="merged-content">
            <header className="merged-header">
              <div><p>YOUTH PROFILE · {pad(activeProfile.slot)} / 10</p><h3>{activeProfile.name}</h3></div>
              <span>{activeProfile.pending ? <>资料<br />待补充</> : <>清廉<br />感悟</>}</span>
              <p>{activeProfile.department}<i />{activeProfile.role}</p>
            </header>

            <section className="module-block" id="profile-intro">
              <div className="module-label"><span>02</span><p>ABOUT ME<small>自我介绍</small></p></div>
              <p>{activeProfile.intro}</p>
            </section>

            <section className="module-block module-reflection" id="profile-reflection">
              <div className="module-label"><span>03</span><p>INTEGRITY AT WORK<small>清廉与岗位感悟</small></p></div>
              <blockquote>“{activeProfile.reflection}”</blockquote>
              <div className="reflection-sign"><span>岗位关键词</span><b>{activeProfile.keyword}</b></div>
            </section>
          </div>
        </article>

        <div className="profile-switcher">
          <button type="button" onClick={previousProfile} aria-label="上一位青年员工">← <span>上一位</span></button>
          <div><i style={{ width: `${((activeIndex + 1) / youthProfiles.length) * 100}%` }} /></div>
          <p><b>{pad(activeIndex + 1)}</b> / 10</p>
          <button type="button" onClick={nextProfile} aria-label="下一位青年员工"><span>下一位</span> →</button>
        </div>
        <p className="swipe-tip">手机端可左右滑动切换员工档案</p>
      </section>

      <section className="closing section-pad" data-reveal>
        <p className="eyebrow">PURE HEART · STEADY STEPS</p>
        <div className="closing-seal">廉</div>
        <h2>以莲为鉴守初心<br /><em>以廉为帆赴未来</em></h2>
        <p>心有所畏，言有所戒，行有所止。<br />让青春在清正担当中绽放，让清风在金融一线常驻。</p>
        <a href="#top">返回首页 <span aria-hidden="true">↑</span></a>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><img src="/boc-logo.png" alt="" /><span><strong>中国银行益阳分行</strong><small>BANK OF CHINA · YIYANG BRANCH</small></span></div>
        <div className="footer-meta" aria-label="栏目制作信息">
          <p><b>来源</b> 中国银行益阳分行团委</p>
          <p><b>编辑</b> 曾子刚、吴希雅</p>
          <p><b>审核</b> 刘娟</p>
        </div>
      </footer>
    </main>
  );
}
