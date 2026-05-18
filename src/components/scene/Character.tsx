"use client";
import { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore, type CharacterState } from "@/state/useSceneStore";
import { createHologramMaterial } from "@/lib/hologramMaterial";

const POSITIONS: Record<CharacterState, THREE.Vector3> = {
  IDLE_HOLOGRAM:       new THREE.Vector3(0,     1.0,  0),
  WAVING:              new THREE.Vector3(0,     1.0,  0),
  WALKING_TO_DESK:     new THREE.Vector3(-1.7,  0.49, 0.3),
  SITTING_AT_DESK:     new THREE.Vector3(-1.7,  0.49, 0.3),
  WALKING_TO_GUITAR:   new THREE.Vector3(2.0,   0.49, 0.3),
  SITTING_GUITAR:      new THREE.Vector3(2.0,   0.49, 0.3),
  PLAYING_GUITAR:      new THREE.Vector3(2.0,   0.49, 0.3),
  RETURNING_TO_CENTER: new THREE.Vector3(0,     1.0,  0),
};

const ROTATIONS: Record<CharacterState, number> = {
  IDLE_HOLOGRAM:       0,
  WAVING:              0,
  WALKING_TO_DESK:    -Math.PI * 0.83,
  SITTING_AT_DESK:    -Math.PI * 0.83,
  WALKING_TO_GUITAR:   Math.PI * 0.7,
  SITTING_GUITAR:      Math.PI * 0.7,
  PLAYING_GUITAR:      Math.PI * 0.7,
  RETURNING_TO_CENTER: 0,
};

const SMALL_STATES: ReadonlyArray<CharacterState> = [
  "WALKING_TO_DESK", "SITTING_AT_DESK",
  "WALKING_TO_GUITAR", "SITTING_GUITAR", "PLAYING_GUITAR",
];

const targetPos = new THREE.Vector3();

// Chibi palette — kept for reference; hologram mat overrides at runtime
const C = {
  skin:  "#FFCD94", skinD:  "#F0B870",
  hair:  "#2D1A0E", hairH:  "#4A2E18",
  shirt: "#3377EE", shirtD: "#2255BB",
  pants: "#22336A", pantsD: "#1A2850",
  shoe:  "#1A1A22", shoeS:  "#DDDDDD",
  white: "#FFFFFF", eye:    "#1A1A2A",
  mouth: "#CC5555", cheek:  "#FFAABB",
  lace:  "#EEEEEE",
};

function Box({
  pos, size, color, emissive = "#000000", emissiveIntensity = 0,
  metalness = 0.1, roughness = 0.8,
}: {
  pos: [number,number,number]; size: [number,number,number]; color: string;
  emissive?: string; emissiveIntensity?: number; metalness?: number; roughness?: number;
}) {
  return (
    <mesh position={pos} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={emissive}
        emissiveIntensity={emissiveIntensity} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

// Subscribes to state for HUD elements — isolated so Character itself never re-renders on state change
function CharacterHud() {
  const charState = useSceneStore(s => s.character);
  const visible = charState === "IDLE_HOLOGRAM" || charState === "WAVING";

  return (
    <>
      {visible && (
        <Billboard position={[0, 2.55, 0]}>
          <Html center distanceFactor={5}>
            <div style={{
              fontFamily: "Orbitron, sans-serif",
              color: "#00fff0",
              fontSize: "11px",
              fontWeight: 700,
              textShadow: "0 0 8px #00fff0, 0 0 20px #00fff0",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              letterSpacing: "0.12em",
            }}>
              JAYSON PONIO MALLARI
            </div>
            <div style={{
              fontFamily: "Rajdhani, sans-serif",
              color: "#b266ff",
              fontSize: "9px",
              fontWeight: 600,
              textShadow: "0 0 6px #b266ff",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              textAlign: "center",
              marginTop: "2px",
              letterSpacing: "0.08em",
            }}>
              {"// Vibe Coder"}
            </div>
          </Html>
        </Billboard>
      )}
      {charState === "WAVING" && (
        <Billboard position={[0.55, 2.85, 0]}>
          <Html center distanceFactor={5}>
            <div style={{
              background: "rgba(0,255,240,0.07)",
              border: "1px solid rgba(0,255,240,0.55)",
              borderRadius: "8px 8px 8px 2px",
              padding: "5px 10px",
              color: "#00fff0",
              fontSize: "11px",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 600,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              textShadow: "0 0 8px #00fff0",
              boxShadow: "0 0 12px rgba(0,255,240,0.12)",
            }}>
              {"// hey! o/"}
            </div>
          </Html>
        </Billboard>
      )}
    </>
  );
}

export function Character() {
  const groupRef  = useRef<THREE.Group>(null);
  const bodyRef   = useRef<THREE.Group>(null);
  const headRef   = useRef<THREE.Group>(null);
  const armLRef   = useRef<THREE.Group>(null);
  const armRRef   = useRef<THREE.Group>(null);
  const legLRef   = useRef<THREE.Group>(null);
  const legRRef   = useRef<THREE.Group>(null);
  const walkPhase = useRef(0);

  const hologramMat = useMemo(() => createHologramMaterial(), []);

  // Apply hologram material to every mesh in the character group
  useLayoutEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = hologramMat;
    });
  }, [hologramMat]);

  useEffect(() => () => { hologramMat.dispose(); }, [hologramMat]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const cur = useSceneStore.getState().character;
    const t   = state.clock.elapsedTime;

    hologramMat.uniforms.time.value = t;

    // ── position ──
    targetPos.copy(POSITIONS[cur]);
    g.position.lerp(targetPos, 0.05);

    // ── rotation ──
    if (cur === "IDLE_HOLOGRAM") {
      g.rotation.y = t * 0.4;
    } else if (cur === "WAVING") {
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, 0, 0.05);
    } else {
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, ROTATIONS[cur], 0.07);
    }

    // ── scale ──
    const ts = SMALL_STATES.includes(cur) ? 0.85 : 1.0;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, ts, 0.06));

    const sitting = cur === "SITTING_AT_DESK" || cur === "SITTING_GUITAR" || cur === "PLAYING_GUITAR";
    const walking = cur === "WALKING_TO_DESK"  || cur === "WALKING_TO_GUITAR";

    const lerp = (r: { current: THREE.Group | null }, axis: "x"|"y"|"z", target: number) => {
      if (r.current) r.current.rotation[axis] = THREE.MathUtils.lerp(r.current.rotation[axis], target, 0.1);
    };

    if (walking) {
      walkPhase.current += delta * 10;
      const sw = Math.sin(walkPhase.current);
      lerp(armLRef, "x",  sw * 0.7);
      lerp(armRRef, "x", -sw * 0.7);
      lerp(armLRef, "z", 0);
      lerp(armRRef, "z", 0);
      lerp(legLRef, "x", -sw * 0.55);
      lerp(legRRef, "x",  sw * 0.55);
      lerp(headRef, "x", 0);
      lerp(bodyRef, "x", Math.sin(walkPhase.current * 2) * 0.03);
    } else if (sitting) {
      lerp(armLRef, "x", -Math.PI * 0.38);
      lerp(armRRef, "x", -Math.PI * 0.38);
      lerp(armLRef, "z", 0);
      lerp(armRRef, "z", 0);
      lerp(legLRef, "x", -Math.PI * 0.45);
      lerp(legRRef, "x", -Math.PI * 0.45);
      lerp(headRef, "x", -0.22);
      lerp(bodyRef, "x", -0.14);
    } else if (cur === "WAVING") {
      // right arm raised + oscillating forward/back
      lerp(armRRef, "x", Math.sin(t * 5.5) * 0.28);
      lerp(armRRef, "z", 1.85);
      lerp(armLRef, "x", 0);
      lerp(armLRef, "z", 0);
      lerp(legLRef, "x", 0);
      lerp(legRRef, "x", 0);
      lerp(headRef, "x", 0);
      lerp(bodyRef, "x", 0);
    } else {
      // idle — subtle arm bob
      const idleSw = Math.sin(t * 1.8) * 0.06;
      lerp(armLRef, "x", -idleSw);
      lerp(armRRef, "x",  idleSw);
      lerp(armLRef, "z", 0);
      lerp(armRRef, "z", 0);
      lerp(legLRef, "x", 0);
      lerp(legRRef, "x", 0);
      lerp(headRef, "x", 0);
      lerp(bodyRef, "x", 0);
    }

    // idle + wave float bounce
    if (cur === "IDLE_HOLOGRAM" || cur === "WAVING") {
      g.position.y += Math.sin(t * 2.2) * 0.018;
    }

    // ── auto state transitions on arrival ──
    if (cur === "WALKING_TO_DESK" && g.position.distanceTo(POSITIONS.SITTING_AT_DESK) < 0.15)
      useSceneStore.getState().setCharacter("SITTING_AT_DESK");
    else if (cur === "WALKING_TO_GUITAR" && g.position.distanceTo(POSITIONS.SITTING_GUITAR) < 0.15)
      useSceneStore.getState().setCharacter("SITTING_GUITAR");
    else if (cur === "RETURNING_TO_CENTER" && g.position.distanceTo(POSITIONS.IDLE_HOLOGRAM) < 0.15)
      useSceneStore.getState().setCharacter("IDLE_HOLOGRAM");
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const store = useSceneStore.getState();
    if (store.character === "IDLE_HOLOGRAM") store.wave();
  };

  return (
    <>
      <group ref={groupRef} position={[0, 1.0, 0]} onClick={handleClick}>

        {/* ══════════ TORSO ══════════ */}
        <group ref={bodyRef}>

          {/* torso body */}
          <Box pos={[0, 0.26, 0]} size={[0.46, 0.52, 0.28]} color={C.shirt} />
          {/* torso side shading */}
          <Box pos={[-0.23, 0.26, 0]} size={[0.005, 0.52, 0.28]} color={C.shirtD} />
          <Box pos={[ 0.23, 0.26, 0]} size={[0.005, 0.52, 0.28]} color={C.shirtD} />
          {/* collar */}
          <Box pos={[0, 0.5, 0.141]} size={[0.18, 0.06, 0.005]} color={C.white} />
          {/* shirt button line */}
          <Box pos={[0, 0.28, 0.141]} size={[0.025, 0.3, 0.005]} color={C.white} />
          {[0.44, 0.34, 0.24].map((y, i) => (
            <mesh key={i} position={[0, y, 0.142]} castShadow>
              <sphereGeometry args={[0.018, 6, 6]} />
              <meshStandardMaterial color={C.white} roughness={0.3} metalness={0.2} />
            </mesh>
          ))}

          {/* ══════════ HEAD ══════════ */}
          <group ref={headRef} position={[0, 0.82, 0]}>

            {/* skull */}
            <Box pos={[0, 0, 0]}      size={[0.52, 0.52, 0.52]} color={C.skin} />
            <Box pos={[-0.261, 0, 0]} size={[0.005, 0.52, 0.52]} color={C.skinD} />
            <Box pos={[ 0.261, 0, 0]} size={[0.005, 0.52, 0.52]} color={C.skinD} />

            {/* ── HAIR ── */}
            <Box pos={[0, 0.285, 0]}      size={[0.56, 0.09, 0.56]}  color={C.hair} />
            <Box pos={[0, 0.1, -0.29]}    size={[0.52, 0.42, 0.06]}  color={C.hair} />
            <Box pos={[0,  0.22, 0.291]}  size={[0.54, 0.14, 0.04]}  color={C.hair} />
            <Box pos={[-0.18, 0.14, 0.293]} size={[0.18, 0.1, 0.04]} color={C.hair} />
            <Box pos={[ 0.18, 0.16, 0.293]} size={[0.14, 0.06, 0.04]} color={C.hair} />
            <Box pos={[-0.285, 0.04, 0]} size={[0.04, 0.34, 0.52]}  color={C.hair} />
            <Box pos={[ 0.285, 0.04, 0]} size={[0.04, 0.34, 0.52]}  color={C.hair} />

            {/* ── FACE ── */}
            {[-0.13, 0.13].map((x, i) => (
              <group key={i} position={[x, 0.02, 0.263]}>
                <mesh>
                  <boxGeometry args={[0.1, 0.1, 0.01]} />
                  <meshStandardMaterial color={C.white} roughness={0.9} />
                </mesh>
                <mesh position={[0, 0, 0.006]}>
                  <boxGeometry args={[0.072, 0.072, 0.01]} />
                  <meshStandardMaterial color="#3366CC" roughness={0.8} />
                </mesh>
                <mesh position={[0.012, -0.008, 0.013]}>
                  <boxGeometry args={[0.038, 0.038, 0.01]} />
                  <meshStandardMaterial color={C.eye} roughness={0.9} />
                </mesh>
                <mesh position={[-0.018, 0.02, 0.02]}>
                  <boxGeometry args={[0.022, 0.022, 0.005]} />
                  <meshStandardMaterial color={C.white} roughness={0.5} />
                </mesh>
              </group>
            ))}
            {[-0.13, 0.13].map((x, i) => (
              <Box key={i} pos={[x, 0.1, 0.263]} size={[0.1, 0.025, 0.01]} color={C.hair} />
            ))}
            <Box pos={[0, -0.1, 0.263]}   size={[0.1,  0.025, 0.01]} color={C.mouth} />
            <Box pos={[-0.055, -0.085, 0.263]} size={[0.025, 0.04, 0.01]} color={C.mouth} />
            <Box pos={[ 0.055, -0.085, 0.263]} size={[0.025, 0.04, 0.01]} color={C.mouth} />
            {[-0.2, 0.2].map((x, i) => (
              <mesh key={i} position={[x, -0.04, 0.263]}>
                <circleGeometry args={[0.055, 12]} />
                <meshBasicMaterial color={C.cheek} transparent opacity={0.55} />
              </mesh>
            ))}
          </group>
        </group>

        {/* ══════════ ARMS ══════════ */}
        {(
          [{ ref: armLRef, x: -0.33, sx: -1 }, { ref: armRRef, x: 0.33, sx: 1 }] as const
        ).map((a, i) => (
          <group key={`arm-${i}`} ref={a.ref} position={[a.x, 0.46, 0]}>
            <Box pos={[0, -0.02, 0]} size={[0.22, 0.04, 0.24]} color={C.shirt} />
            <Box pos={[0, -0.17, 0]} size={[0.2,  0.28, 0.22]} color={C.shirt} />
            <Box pos={[0, -0.315, 0]} size={[0.21, 0.015, 0.23]} color={C.shirtD} />
            <Box pos={[0, -0.44, 0]} size={[0.2,  0.26, 0.22]} color={C.skin} />
          </group>
        ))}

        {/* ══════════ LEGS ══════════ */}
        {(
          [{ ref: legLRef, x: -0.115 }, { ref: legRRef, x: 0.115 }] as const
        ).map((l, i) => (
          <group key={`leg-${i}`} ref={l.ref} position={[l.x, 0, 0]}>
            <Box pos={[0, -0.19,  0]}     size={[0.21, 0.38,  0.24]} color={C.pants} />
            <Box pos={[0, -0.385, 0]}     size={[0.22, 0.014, 0.245]} color={C.pantsD} />
            <Box pos={[0, -0.55,  0]}     size={[0.2,  0.3,   0.23]} color={C.pants} />
            <Box pos={[0, -0.735, 0.025]} size={[0.22, 0.1,   0.28]} color={C.shoe} />
            <Box pos={[0, -0.787, 0.025]} size={[0.225,0.014, 0.285]} color={C.shoeS} />
            <Box pos={[0, -0.71,  0.155]} size={[0.19, 0.05,  0.012]} color={C.lace} />
          </group>
        ))}

      </group>

      {/* HUD — isolated component subscribes to state independently */}
      <CharacterHud />
    </>
  );
}
