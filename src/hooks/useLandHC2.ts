// src/hooks/useLandHC2.ts
"use client";
import { useEffect, useState } from "react";
import { useGetLandHC2Query, useUpdateLandHC2Mutation } from "@/redux/api";

export default function useLandHC2() {
  // В options передаём флаги:
  // - refetchOnMountOrArgChange: при каждом монтировании хука
  // - refetchOnFocus: когда вкладка снова в фокусе
  const { data, isFetching, refetch } = useGetLandHC2Query(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const [save] = useUpdateLandHC2Mutation();

  const [value, setValue] = useState("1");

  useEffect(() => {
    if (!isFetching && data?.default_land_hc2 != null) {
      setValue(String(data.default_land_hc2));
    }
  }, [isFetching, data]);

  const persist = async (next: string) => {
    await save({ default_land_hc2: next }).unwrap();
    setValue(next);
    // после сохранения можно сразу рефетчить, чтобы синхронизировать с бекендом
    refetch();
  };

  return { value, loading: isFetching, persist };
}
