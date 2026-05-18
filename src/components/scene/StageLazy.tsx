"use client";
import dynamic from "next/dynamic";

const Stage = dynamic(() => import("./Stage"), {
  ssr: false,
  loading: () => null,
});

export default function StageLazy() {
  return <Stage />;
}
