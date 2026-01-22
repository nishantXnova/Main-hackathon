import React from 'react';

const PlaceCard = ({ title, description, image }) => (
  <div className="place">
    <img className="place-img" src={image} alt={title} loading="lazy" />
    <h4 className="montserrat-800">{title}</h4>
    <p className="place-desc lora-400">{description}</p>
  </div>
);

const PlacesList = () => {
  const places = [
    { title: 'Kathmandu Valley', image: '/top_places/kathmandu.jpg', description: 'The Kathmandu Valley is a culturally rich and historically significant region in Nepal, known for its three ancient cities: Kathmandu, Patan, and Bhaktapur.' },
    { title: 'Pokhara', image: '/top_places/pokhara.jpg', description: "Pokhara, often referred to as the 'Jewel of Nepal,' is a vibrant city nestled in the lap of the Annapurna mountain range." },
    { title: 'Boudhanath Stupa', image: '/top_places/boudhanath.png', description: "The Boudhanath Stupa, located in Kathmandu, Nepal, is one of the largest stupas in the world and a major spiritual landmark in Tibetan Buddhism." }
  ];
  return <div className="places-list">{places.map((p, i) => <PlaceCard key={i} {...p} />)}</div>;
};

export default PlacesList;
