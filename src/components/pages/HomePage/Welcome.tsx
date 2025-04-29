"use client";
import { FC, useState } from "react";

const Welcome: FC = () => {
  const [form, setForm] = useState<{
    k1: string;
    k2: string;
    k3: string;
    k4: string;
    areaObject: string;
    areaLand: string;
    areaBuilding: string;
    commercialUse: string;
    streetAccess: boolean;
  }>({
    k1: "",
    k2: "",
    k3: "",
    k4: "",
    areaObject: "",
    areaLand: "",
    areaBuilding: "",
    commercialUse: "",
    streetAccess: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    // ваша логика расчёта
  };

  return (
    <section className="bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white shadow-sm rounded-lg p-6">
          {/* Заголовок */}
          <h2 className="text-2xl font-semibold text-gray-900">
            Калькулятор аренды
          </h2>
          {/* зелёная линия */}
          <div className="w-16 h-1 bg-green-600 mt-2 mb-4"></div>
          {/* разделитель */}
          <hr className="border-t border-gray-200 mb-6" />

          <form onSubmit={handleSubmit}>
            <div className="grid-cols-1 lg:grid-cols-2 flex flex-col gap-x-8 gap-y-6">
              {/* K1 */}
              <div>
                <label
                  htmlFor="k1"
                  className="block mb-1 text-blue-600 font-normal"
                >
                  Населенный пункт (K1)
                </label>
                <select
                  id="k1"
                  name="k1"
                  value={form.k1}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-md
                    px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-green-600
                  "
                >
                  <option value="">выберите из списка</option>
                </select>
              </div>
              {/* K2 */}
              <div>
                <label
                  htmlFor="k2"
                  className="block mb-1 text-blue-600 font-normal"
                >
                  Техническое состояние помещения (K2)
                </label>
                <select
                  id="k2"
                  name="k2"
                  value={form.k2}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-md
                    px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-green-600
                  "
                >
                  <option value="">выберите из списка</option>
                </select>
              </div>
              {/* K3 */}
              <div>
                <label
                  htmlFor="k3"
                  className="block mb-1 text-blue-600 font-normal"
                >
                  Техническое обустройство здания (K3)
                </label>
                <select
                  id="k3"
                  name="k3"
                  value={form.k3}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-md
                    px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-green-600
                  "
                >
                  <option value="">выберите из списка</option>
                </select>
              </div>
              {/* K4 */}
              <div>
                <label
                  htmlFor="k4"
                  className="block mb-1 text-blue-600 font-normal"
                >
                  Цель аренды (K4)
                </label>
                <select
                  id="k4"
                  name="k4"
                  value={form.k4}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-md
                    px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-green-600
                  "
                >
                  <option value="">выберите из списка</option>
                </select>
              </div>

              {/* Площадь арендуемого объекта */}
              <div>
                <label
                  htmlFor="areaObject"
                  className="block mb-1 text-blue-600 font-normal"
                >
                  Площадь арендуемого объекта
                </label>
                <input
                  type="text"
                  id="areaObject"
                  name="areaObject"
                  placeholder="Площадь арендуемого объекта (кв.м)"
                  value={form.areaObject}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-md
                    px-3 py-2
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-green-600
                  "
                />
              </div>

              {/* Площадь земельного участка */}
              <div>
                <label
                  htmlFor="areaLand"
                  className="block mb-1 text-blue-600 font-normal"
                >
                  Площадь земельного участка
                </label>
                <input
                  type="text"
                  id="areaLand"
                  name="areaLand"
                  placeholder="Площадь земельного участка кв.м"
                  value={form.areaLand}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-md
                    px-3 py-2
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-green-600
                  "
                />
              </div>

              {/* Площадь здания */}
              <div>
                <label
                  htmlFor="areaBuilding"
                  className="block mb-1 text-blue-600 font-normal"
                >
                  Площадь здания
                </label>
                <input
                  type="text"
                  id="areaBuilding"
                  name="areaBuilding"
                  placeholder="Площадь здания (кв.м)"
                  value={form.areaBuilding}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-md
                    px-3 py-2
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-green-600
                  "
                />
              </div>

              {/* Коммерческое использование земли */}
              <div>
                <label
                  htmlFor="commercialUse"
                  className="block mb-1 text-blue-600 font-normal"
                >
                  Коммерческое использование земли
                </label>
                <select
                  id="commercialUse"
                  name="commercialUse"
                  value={form.commercialUse}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-md
                    px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-green-600
                  "
                >
                  <option value="">выберите из списка</option>
                </select>
              </div>
            </div>

            {/* Чекбокс */}
            <div className="mt-4 flex items-center">
              <input
                id="streetAccess"
                type="checkbox"
                name="streetAccess"
                checked={form.streetAccess}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <label
                htmlFor="streetAccess"
                className="ml-2 text-gray-800 font-normal"
              >
                Объект расположен вдоль улицы и имеет отдельный вход/выход
              </label>
            </div>

            {/* Кнопка */}
            <button
              type="submit"
              className="
                mt-6
                bg-green-600 hover:bg-green-700
                text-white
                font-medium
                py-2 px-4
                rounded
              "
            >
              Рассчитать стоимость аренды
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
