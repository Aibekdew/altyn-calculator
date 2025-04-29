"use client";

import React, { FC, useState } from "react";
import scss from "./LogIn.module.scss";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LogIn: FC = () => {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const dx = e.clientX - cx;
    const dy = cy - e.clientY;
    const maxAngle = 10; // макс градус наклона
    const maxOffset = 20; // макс смещение фона (px)

    const rotateY = (dx / (box.width / 2)) * maxAngle;
    const rotateX = (dy / (box.height / 2)) * maxAngle;
    setTilt({ rotateX, rotateY });

    const offsetX = -(dx / (box.width / 2)) * maxOffset;
    const offsetY = -(dy / (box.height / 2)) * maxOffset;
    setBgOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setBgOffset({ x: 0, y: 0 });
  };

  return (
    <section
      className={scss.page}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={scss.background}
        style={{
          transform: `translate3d(${bgOffset.x}px, ${bgOffset.y}px, 0) scale(1.1)`,
        }}
      />
      <div
        className={scss.card}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.02)`,
        }}
      >
        <div className={scss.kyrgyz}>
          <img src="/image/logo.png" alt="logo" />
          <div className={scss.kyrgyz_text}>
            <h1>КЫРГЫЗАЛТЫН</h1>
          </div>
        </div>

        {/* Логин */}
        <div className={scss.inputGroup}>
          <label className={scss.label}>Логин</label>
          <div className={scss.inputWrapper}>
            <input type="email" className={scss.input} />
            <span className={scss.underline} />
            <div className={scss.emailIcon} />
          </div>
        </div>

        {/* Пароль */}
        <div className={scss.inputGroup}>
          <label className={scss.label}>Пароль</label>
          <div className={scss.inputWrapper}>
            <input
              type={showPass ? "text" : "password"}
              className={scss.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className={scss.underline} />
            {password.length > 0 &&
              (showPass ? (
                <AiOutlineEyeInvisible
                  className={scss.toggleIcon}
                  onClick={() => setShowPass(false)}
                />
              ) : (
                <AiOutlineEye
                  className={scss.toggleIcon}
                  onClick={() => setShowPass(true)}
                />
              ))}
          </div>
        </div>

        <button type="submit" className={scss.button}>
          Войти
        </button>
      </div>
    </section>
  );
};

export default LogIn;
