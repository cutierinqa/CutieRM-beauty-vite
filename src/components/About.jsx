import React from "react";
import { Link } from "react-router-dom";
import "../styles/stylesabout.css";

import o1 from "../assets/o1.png";
import o2 from "../assets/o2.png";
import o3 from "../assets/o3.png";
import o4 from "../assets/o4.png";
import o5 from "../assets/o5.png";
import o6 from "../assets/o6.png";
import photo1 from "../assets/photo1.png";
import photo2 from "../assets/photo2.jpg";
import photo3 from "../assets/photo3.jpg";
import photo4 from "../assets/photo4.jpg";
import photo5 from "../assets/photo5.png";

const About = () => {
  return (
    <div className="about-page">
      

      <section className="about-us">
        <div className="left-reviews">
          {[o1, o2, o3].map((img, idx) => (
            <div key={idx} className="review-item">
              <img src={img} alt={`Отзыв ${idx + 1}`} />
            </div>
          ))}
        </div>

        <div className="right-reviews">
          {[o4, o5, o6].map((img, idx) => (
            <div key={idx} className="review-item">
              <img src={img} alt={`Отзыв ${idx + 4}`} />
            </div>
          ))}
        </div>

        <div className="about-content">
          <div className="left-column">
            <h2>СТУДИЯ КРАСОТЫ</h2>
            <h1>
              <span className="color-purple">NOVA</span>
            </h1>
            <p className="big-text">ВАШ ПУТЬ К<br />ИСКУССТВУ<br />КРАСОТЫ</p>
            <p className="medium-text">БУДЬ ЯРКОЙ,<br />БУДЬ НЕПОВТОРИМОЙ</p>
            <p className="small-text">ПОДЧЕРКНИ СВОЮ УНИКАЛЬНОСТЬ</p>
            <Link to="/zapis" className="primary-btn">
              Записаться прямо сейчас
            </Link>
          </div>

          <div className="right-column">
            <p>
              ✨ Добро пожаловать в студию красоты <span className="color-purple">NOVA</span>! Мы создаём образы, которые не только подчёркивают вашу природную красоту, но и делают её ещё более выразительной.
            </p>
            <p>
              Наши мастера — настоящие профессионалы своего дела, которые подходят к каждому клиенту с теплотой и вниманием к деталям.
            </p>
            <p>💎 Мы предлагаем:</p>
            <ul className="features-list">
              <li>- Профессиональные стрижки и укладки для любого случая</li>
              <li>- Авторский макияж, подчёркивающий индивидуальность</li>
              <li>- Уход за волосами и кожей с использованием премиальных средств</li>
              <li>- Креативный нейл-арт и стильный маникюр</li>
            </ul>
            <p>
              Каждое посещение салона — это ваше время для обновления и уверенности в себе. Мы создаём настроение, которое остаётся с вами надолго.
            </p>
            <p>
              🎉 Присоединяйтесь к тем, кто уже выбрал <span className="color-purple">NOVA</span> и почувствовал себя неотразимой!
            </p>
          </div>
        </div>
      </section>

      <section className="about-us2">
        <div className="gallery">
          {[photo1, photo2, photo3, photo4, photo5].map((img, idx) => (
            <div key={idx} className="gallery-item">
              <img src={img} alt={`Пример работы ${idx + 1}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
