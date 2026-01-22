import React from 'react';

const ProvinceItem = ({ title, description, image }) => (
  <div className="province">
    <div className="province-text">
      <h4 className="montserrat-700">{title}</h4>
      <p className="lora-400">{description}</p>
    </div>
    <div className="province-media">
      <img className="province-img" src={image} alt={title} loading="lazy" />
    </div>
  </div>
);

const ProvincesSection = () => {
  const provinces = [
    { title: 'Province 1', image: '/Provinces/Illam-1631441491.jpg', description: 'Province 1 is located in the eastern part of Nepal and is known for its diverse landscapes, including mountains, hills, and Terai plains.' },
    { title: 'Province 2', image: '/Provinces/janakpur_ss_lt-1624431003.jpeg', description: 'Province 2, also known as Madhesh Province, is in the southeastern Terai region. It is rich in agriculture and has historical sites like Janakpur.' },
    { title: 'Bagmati Province', image: '/Provinces/kathmandu_oy_lt2-1624431334.jpeg', description: 'Bagmati Province is the central province and includes the capital city Kathmandu. It is known for its cultural heritage and urban development.' },
    { title: 'Gandaki Province', image: '/Provinces/Gandaki-1631441545.jpg', description: 'Gandaki Province is home to the Annapurna mountain range and Pokhara. It offers stunning natural beauty and is a hub for adventure tourism.' },
    { title: 'Lumbini Province', image: '/Provinces/Lumbini-1631441562.jpg', description: 'Lumbini Province is the birthplace of Buddha and includes the Lumbini site. It is significant for its religious and historical importance.' },
    { title: 'Karnali Province', image: '/Provinces/shey-1626727697.jpeg', description: 'Karnali Province is in the mid-western region and features rugged terrains, rivers, and is known for its natural resources and biodiversity.' },
    { title: 'Sudurpashchim Province', image: '/Provinces/Khaptad_taan_trekker_(6)-1624819036.jpg', description: 'Sudurpashchim Province, the far-western province, includes areas near the border with India and features diverse landscapes.' }
  ];
  return (
    <div id="provinces">
      <div className="info-text">
        <h3>Provinces of Nepal</h3>
        <div className="nepal-map"><img className="nepal-map-img" src="/Provinces/map.png" alt="Nepal Map with Provinces" loading="lazy" /></div>
        <div className="provinces-list">{provinces.map((p, i) => <ProvinceItem key={i} {...p} />)}</div>
      </div>
    </div>
  );
};

export default ProvincesSection;
