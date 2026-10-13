import React from 'react';
import { Icon } from '@iconify/react';
import sassIcon from '@iconify/icons-logos/sass';
import reactIcon from '@iconify/icons-logos/react';
import jsIcon from '@iconify/icons-logos/javascript';

export default function About({ resumeBasicInfo, sharedBasicInfo, labels }) {
  return <section id="about">
    <h2 className="section-title">{resumeBasicInfo.section_name.about}</h2>
    <div className="row center mx-auto mb-5">
      <div className="col-md-4 mb-5 center">
        <div className="polaroid"><span>
          <img height="285" src={`/images/${sharedBasicInfo.image}`} alt={labels.profilePhoto} loading="lazy" />
          {[sassIcon, reactIcon, jsIcon].map((icon, index) => <Icon key={index} icon={icon} aria-hidden="true"
            style={{ fontSize: '400%', margin: '9% 5% 0 5%' }} />)}
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
