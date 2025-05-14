"use client";

import React, { FC, useState, FormEvent } from "react";
import scss from "./LogIn.module.scss";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import axios from "axios";

const LogIn: FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // 3D-эффекты
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = box.top + box.height / 2 - e.clientY;
    const maxAngle = 10,
      maxOffset = 20;

    setTilt({
      rotateX: (dy / (box.height / 2)) * maxAngle,
      rotateY: (dx / (box.width / 2)) * maxAngle,
    });
    setBgOffset({
      x: -(dx / (box.width / 2)) * maxOffset,
      y: -(dy / (box.height / 2)) * maxOffset,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setBgOffset({ x: 0, y: 0 });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Введите логин и пароль");
      return;
    }

    try {
      // Замените URL на ваш реальный эндпоинт
      const res = await axios.post("/api/auth/login", { email, password });
      // сохраняем токен
      localStorage.setItem("token", res.data.token);
      // идём на /home
      router.push("/home");
    } catch {
      setError("Неправильный логин или пароль");
    }
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
          transform: `translate3d(${bgOffset.x}px,${bgOffset.y}px,0) scale(1.1)`,
        }}
      />
      <div
        className={scss.card}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.02)`,
        }}
      >
        <form onSubmit={handleSubmit} className={scss.form}>
          <div className={scss.kyrgyz}>
            <img src="/image/logo.png" alt="logo" />
            <div className={scss.kyrgyz_text}>
              <h1>КЫРГЫЗАЛТЫН</h1>
            </div>
          </div>

          {/* Ошибка */}
          {error && <div className={scss.error}>{error}</div>}

          {/* Email */}
          <div className={scss.inputGroup}>
            <label className={scss.label}>Логин (email)</label>
            <div className={scss.inputWrapper}>
              <input
                type="email"
                className={scss.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className={scss.underline} />
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
                required
              />
              <span className={scss.underline} />
              {password &&
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
        </form>
      </div>
    </section>
  );
};

export default LogIn;

// "use client";

// import React, { FC, useState, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import Image from "next/image";
// import Link from "next/link";

// const LogIn: FC = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
//   const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     const box = e.currentTarget.getBoundingClientRect();
//     const dx = e.clientX - (box.left + box.width / 2);
//     const dy = box.top + box.height / 2 - e.clientY;
//     const maxAngle = 10,
//       maxOffset = 20;
//     setTilt({
//       rotateX: (dy / (box.height / 2)) * maxAngle,
//       rotateY: (dx / (box.width / 2)) * maxAngle,
//     });
//     setBgOffset({
//       x: -(dx / (box.width / 2)) * maxOffset,
//       y: -(dy / (box.height / 2)) * maxOffset,
//     });
//   };

//   const handleMouseLeave = () => {
//     setTilt({ rotateX: 0, rotateY: 0 });
//     setBgOffset({ x: 0, y: 0 });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError("");
//     if (!email || !password) {
//       setError("Введите логин и пароль");
//       return;
//     }
//     try {
//       const res = await axios.post("/api/auth/login", { email, password });
//       const token = res.data.token;
//       localStorage.setItem("token", token);
//       document.cookie = `token=${token}; Path=/; Max-Age=${60 * 60 * 24}`;
//       router.push("/");
//     } catch {
//       setError("Неправильный логин или пароль");
//     }
//   };

//   return (
//     <section
//       className="relative w-full h-screen flex items-center justify-center bg-black"
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//     >
//       {/* фон */}
//       <div className="absolute inset-0 z-0 overflow-hidden">
//         <Image
//           src="/image/loginimg.jpg"
//           alt="фон"
//           fill
//           className="object-cover scale-[1.1] transition-transform duration-200 ease-out"
//           style={{
//             transform: `translate3d(${bgOffset.x}px, ${bgOffset.y}px, 0)`,
//           }}
//           priority
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-10" />
//       </div>

//       {/* карточка */}
//       <div
//         className="relative z-10 w-[90%] max-w-[400px] p-8 md:p-10 rounded-2xl backdrop-blur-lg
//                    bg-gradient-to-br from-[rgba(22,32,55,0.75)] to-[rgba(33,51,83,0.05)]
//                    border border-white/30 border-dashed anim-border-pulse
//                    shadow-lg transition-all duration-200 ease-out cursor-pointer
//                    hover:scale-105 hover:shadow-2xl"
//         style={{
//           transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.02)`,
//         }}
//       >
//         <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//           <div className="flex flex-col items-center">
//             <Image
//               src="/image/logo.png"
//               alt="логотип"
//               width={320}
//               height={120}
//             />
//             <h1 className="mt-4 text-4xl font-bold text-white">КЫРГЫЗАЛТЫН</h1>
//           </div>

//           {error && <div className="text-red-500 text-center">{error}</div>}

//           {/* Email */}
//           <div className="group flex flex-col gap-1">
//             <label className="text-sm text-[#d0d9ff] ml-1 group-focus-within:text-[#21cdff] transition-colors">
//               Логин (email)
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full h-10 bg-transparent border-b border-white/30 text-white pl-1 pr-10 focus:outline-none"
//               />
//               <span
//                 className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-[#2179ff] to-[#21cdff]
//                                scale-x-0 group-focus-within:scale-x-100 transform transition-transform duration-300"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="group flex flex-col gap-1">
//             <label className="text-sm text-[#d0d9ff] ml-1 group-focus-within:text-[#21cdff] transition-colors">
//               Пароль
//             </label>
//             <div className="relative">
//               <input
//                 type={showPass ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full h-10 bg-transparent border-b border-white/30 text-white pl-1 pr-10 focus:outline-none"
//               />
//               <span
//                 className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-[#2179ff] to-[#21cdff]
//                                scale-x-0 group-focus-within:scale-x-100 transform transition-transform duration-300"
//               />
//               {password &&
//                 (showPass ? (
//                   <AiOutlineEyeInvisible
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-[#d0d9ff]
//                                group-focus-within:text-[#21cdff] transition-colors cursor-pointer"
//                     onClick={() => setShowPass(false)}
//                   />
//                 ) : (
//                   <AiOutlineEye
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-[#d0d9ff]
//                                group-focus-within:text-[#21cdff] transition-colors cursor-pointer"
//                     onClick={() => setShowPass(true)}
//                   />
//                 ))}
//             </div>
//           </div>

//           {/* Button */}
//           <Link href={"/"}>
//             <button
//               type="submit"
//               className="relative group h-12 w-full rounded-full text-white font-semibold
//                        bg-gradient-to-r from-[#052a89] to-[#06238c] overflow-hidden transition-transform duration-100 ease-out
//                        hover:-translate-y-0.5 active:translate-y-0"
//             >
//               <span
//                 className="absolute inset-0 bg-gradient-to-r
//                              from-transparent via-white/25 to-transparent
//                              transform -translate-x-full group-hover:translate-x-full
//                              transition-transform duration-500 pointer-events-none"
//               />
//               <span className="relative z-10">Войти</span>
//             </button>
//           </Link>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default LogIn;
