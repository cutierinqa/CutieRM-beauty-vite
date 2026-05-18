import React, { useEffect, useState } from "react";
import "../styles/Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Ошибка загрузки услуг:", err));
  }, []);

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.kategoriya]) acc[service.kategoriya] = [];
    acc[service.kategoriya].push(service);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="services-page">
      <h1>Наши услуги</h1>

      {}
      <div className="categories-grid">
        {Object.keys(groupedServices).map((category) => (
          <div
            key={category}
            className={`category-card ${openCategory === category ? "active" : ""}`}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>

      {}
      {Object.keys(groupedServices).map((category) => (
        <div
          className={`services-list ${openCategory === category ? "open" : ""}`}
          key={category}
        >
          {groupedServices[category].map((service) => (
            <div className="service-item" key={service.id_uslugi}>
              <h3>{service.usluga}</h3>
              <p>{service.opisanie}</p>
              <div className="service-info">
                <span>Длительность: {service.dlitelnost} мин</span>
                <span>Цена: {service.bazovaya_cena} ₽</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Services;
