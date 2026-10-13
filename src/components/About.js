import React from 'react';

export default function About({ resumeBasicInfo, labels }) {
  return <section id="about">
    <h2 className="section-title">{resumeBasicInfo.section_name.about}</h2>
    <div className="row center mx-auto mb-5">
      <div className="col-md-4 mb-5 center">
        <div className="polaroid"><span>
          <img width="200" height="285" src="/images/thumbnails/profile.webp" alt={labels.profilePhoto} loading="lazy" decoding="async" />
          {['sass', 'react', 'javascript'].map(name => <img key={name} className="about-logo"
            src={`/images/icons/${name}.svg`} alt="" aria-hidden="true" width="40" height="40" loading="lazy" />)}
        </span></div>
      </div>
      <div className="col-md-8 center"><div className="col-md-10">
        <div className="card">
          <div className="card-header" aria-hidden="true">● ● ●</div>
          <div className="card-body about-copy font-trebuchet">
            <h3>{resumeBasicInfo.description_header}</h3>
            <p>{resumeBasicInfo.description}</p>
          </div>
        </div>
      </div></div>
    </div>
  </section>;
}
