"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { Monitor } from "./Monitor";
import { Peripherals } from "./Peripherals";
import { CodeMonitor } from "./MonitorScreens/CodeMonitor";
import { TerminalMonitor } from "./MonitorScreens/TerminalMonitor";
import { GamePreviewMonitor } from "./MonitorScreens/GamePreviewMonitor";

const HALF_W = 1.25;
const BACK_Y = 0.48;
const FRONT_Y = -0.58;
const CURVE_OFFSET = 0.18;
const DESK_TOP_Y = 0.74;
const DESK_THICKNESS = 0.04;

/**
 * Curved, ergonomic developer desk. Concave front edge wraps toward the user.
 * Bigger overall than V1, with 3 larger monitors + peripherals + accessories.
 */
export function Desk() {
  const { deskShape, frontEdgeCurve, underglowShape } = useMemo(() => {
    // Top-surface shape (X = width, Y = depth; +Y is "back" away from user)
    const shape = new THREE.Shape();
    shape.moveTo(-HALF_W, BACK_Y);
    shape.lineTo(HALF_W, BACK_Y);
    shape.lineTo(HALF_W, FRONT_Y);
    shape.bezierCurveTo(
      HALF_W * 0.55,
      FRONT_Y + CURVE_OFFSET,
      -HALF_W * 0.55,
      FRONT_Y + CURVE_OFFSET,
      -HALF_W,
      FRONT_Y
    );
    shape.closePath();

    // Curve for the cyan glow tube along the front edge.
    // After mesh rotation [-PI/2, 0, 0], shape's -Y maps to world +Z.
    // So shape Y=-0.58 → world Z=+0.58.
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(HALF_W, DESK_TOP_Y, -FRONT_Y),
      new THREE.Vector3(
        HALF_W * 0.55,
        DESK_TOP_Y,
        -(FRONT_Y + CURVE_OFFSET)
      ),
      new THREE.Vector3(
        -HALF_W * 0.55,
        DESK_TOP_Y,
        -(FRONT_Y + CURVE_OFFSET)
      ),
      new THREE.Vector3(-HALF_W, DESK_TOP_Y, -FRONT_Y)
    );

    // Slightly shrunk shape for the underglow plane (mirrors the curve)
    const ug = new THREE.Shape();
    const ugW = HALF_W * 0.95;
    const ugFrontY = FRONT_Y * 0.95;
    const ugBackY = BACK_Y * 0.95;
    ug.moveTo(-ugW, ugBackY);
    ug.lineTo(ugW, ugBackY);
    ug.lineTo(ugW, ugFrontY);
    ug.bezierCurveTo(
      ugW * 0.55,
      ugFrontY + CURVE_OFFSET * 0.95,
      -ugW * 0.55,
      ugFrontY + CURVE_OFFSET * 0.95,
      -ugW,
      ugFrontY
    );
    ug.closePath();

    return { deskShape: shape, frontEdgeCurve: curve, underglowShape: ug };
  }, []);

  return (
    <group position={[-2.1, 0, -0.4]} rotation={[0, Math.PI * 0.18, 0]}>
      {/* ═══════ CURVED DESK TOP ═══════ */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, DESK_TOP_Y - DESK_THICKNESS, 0]}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[deskShape, { depth: DESK_THICKNESS, bevelEnabled: false }]} />
        <meshStandardMaterial
          color="#0a0814"
          metalness={0.6}
          roughness={0.35}
          emissive="#00fff0"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Glowing curved front edge */}
      <mesh>
        <tubeGeometry args={[frontEdgeCurve, 48, 0.006, 8, false]} />
        <meshBasicMaterial color="#00fff0" toneMapped={false} />
      </mesh>

      {/* Side neon trims (straight edges) */}
      {[-HALF_W, HALF_W].map((x, i) => (
        <mesh key={`side-trim-${i}`} position={[x, DESK_TOP_Y, (BACK_Y + FRONT_Y) / -2]}>
          <boxGeometry args={[0.004, 0.02, BACK_Y - FRONT_Y]} />
          <meshBasicMaterial color="#b266ff" toneMapped={false} />
        </mesh>
      ))}

      {/* Back neon trim */}
      <mesh position={[0, DESK_TOP_Y, -BACK_Y]}>
        <boxGeometry args={[HALF_W * 2, 0.02, 0.004]} />
        <meshBasicMaterial color="#b266ff" toneMapped={false} />
      </mesh>

      {/* Underglow LED (faces floor, mirrors desk shape) */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, DESK_TOP_Y - DESK_THICKNESS - 0.005, 0]}
      >
        <shapeGeometry args={[underglowShape]} />
        <meshBasicMaterial color="#00fff0" transparent opacity={0.18} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Cable management hole on desk top */}
      <mesh position={[-0.6, DESK_TOP_Y + 0.001, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[-0.6, DESK_TOP_Y + 0.001, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.058, 24]} />
        <meshStandardMaterial color="#1a1530" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Desk mat (under keyboard area) */}
      <mesh position={[0, DESK_TOP_Y + 0.0015, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.15, 0.45]} />
        <meshStandardMaterial
          color="#06050f"
          metalness={0.1}
          roughness={0.95}
          emissive="#ff3df0"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Desk mat neon edge (front) */}
      <mesh position={[0, DESK_TOP_Y + 0.002, 0.37]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.15, 0.005]} />
        <meshBasicMaterial color="#ff3df0" toneMapped={false} transparent opacity={0.85} />
      </mesh>

      {/* Modesty panel (back, between rear legs) */}
      <mesh position={[0, 0.42, -BACK_Y + 0.03]} castShadow>
        <boxGeometry args={[2.3, 0.6, 0.025]} />
        <meshStandardMaterial color="#0a0814" metalness={0.45} roughness={0.55} />
      </mesh>
      {/* Modesty panel neon stripes */}
      <mesh position={[0, 0.55, -BACK_Y + 0.043]}>
        <boxGeometry args={[2.1, 0.004, 0.003]} />
        <meshBasicMaterial color="#b266ff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.3, -BACK_Y + 0.043]}>
        <boxGeometry args={[2.1, 0.004, 0.003]} />
        <meshBasicMaterial color="#00fff0" toneMapped={false} />
      </mesh>

      {/* Desk legs (4 at corners) */}
      {(
        [
          [-1.15, 0.36, -0.43],
          [1.15, 0.36, -0.43],
          [-1.15, 0.36, 0.45],
          [1.15, 0.36, 0.45],
        ] as [number, number, number][]
      ).map((p, i) => (
        <mesh key={`leg-${i}`} position={p} castShadow>
          <boxGeometry args={[0.06, 0.72, 0.06]} />
          <meshStandardMaterial color="#0a0814" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* ═══════ RGB AMBIENT GLOW ═══════ */}
      <pointLight position={[0, 1.25, -0.5]} intensity={1.3} color="#ff3df0" distance={3.8} decay={1.5} />
      <pointLight position={[-0.85, 1.1, -0.35]} intensity={0.65} color="#b266ff" distance={2.7} decay={1.6} />
      <pointLight position={[0.85, 1.1, -0.35]} intensity={0.65} color="#00aaff" distance={2.7} decay={1.6} />

      {/* ═══════ MONITORS (bigger, on desk top) ═══════ */}
      <Monitor position={[-0.78, DESK_TOP_Y, -0.18]} rotation={[0, 0.34, 0]} accent="#b266ff">
        <CodeMonitor />
      </Monitor>
      <Monitor position={[0, DESK_TOP_Y, -0.3]} rotation={[0, 0, 0]} accent="#00fff0">
        <TerminalMonitor />
      </Monitor>
      <Monitor position={[0.78, DESK_TOP_Y, -0.18]} rotation={[0, -0.34, 0]} accent="#ff3df0">
        <GamePreviewMonitor />
      </Monitor>

      {/* ═══════ WEBCAM on top of center monitor ═══════ */}
      <group position={[0, 1.35, -0.27]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.045, 0.045]} />
          <meshStandardMaterial color="#0a0814" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.006, 16]} />
          <meshStandardMaterial color="#000" emissive="#ff3df0" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0.042, 0.014, 0.025]}>
          <sphereGeometry args={[0.004, 8, 8]} />
          <meshBasicMaterial color="#ff0000" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.033, -0.025]}>
          <boxGeometry args={[0.07, 0.022, 0.06]} />
          <meshStandardMaterial color="#0a0814" metalness={0.7} roughness={0.25} />
        </mesh>
      </group>

      {/* ═══════ PERIPHERALS ═══════ */}
      <Peripherals />

      {/* ═══════ COFFEE MUG ═══════ */}
      <group position={[0.95, DESK_TOP_Y + 0.005, 0.18]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.044, 0.105, 16]} />
          <meshStandardMaterial color="#15102a" metalness={0.35} roughness={0.5} emissive="#b266ff" emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[0, 0.053, 0]}>
          <torusGeometry args={[0.05, 0.005, 6, 16]} />
          <meshStandardMaterial color="#1a1530" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.048, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial color="#1a0a05" />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <sphereGeometry args={[0.042, 8, 8]} />
          <meshBasicMaterial color="#00fff0" transparent opacity={0.22} toneMapped={false} />
        </mesh>
        <mesh position={[0.013, 0.19, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#00fff0" transparent opacity={0.15} toneMapped={false} />
        </mesh>
        <mesh position={[0.065, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.029, 0.008, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#15102a" metalness={0.35} roughness={0.5} />
        </mesh>
      </group>

      {/* ═══════ HEADPHONES STAND ═══════ */}
      <group position={[-0.98, DESK_TOP_Y + 0.005, -0.05]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.015, 0.2, 12]} />
          <meshStandardMaterial color="#0a0814" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.006, 0]}>
          <cylinderGeometry args={[0.075, 0.08, 0.012, 16]} />
          <meshStandardMaterial color="#0a0814" metalness={0.6} roughness={0.3} emissive="#00fff0" emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.013, 6, 16, Math.PI]} />
          <meshStandardMaterial color="#0a0814" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[-0.07, 0.21, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
          <meshStandardMaterial color="#0a0814" emissive="#b266ff" emissiveIntensity={0.55} metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0.07, 0.21, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
          <meshStandardMaterial color="#0a0814" emissive="#b266ff" emissiveIntensity={0.55} metalness={0.4} roughness={0.5} />
        </mesh>
      </group>

      {/* ═══════ PLANT IN POT ═══════ */}
      <group position={[0.98, DESK_TOP_Y + 0.005, -0.32]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.062, 0.05, 0.085, 12]} />
          <meshStandardMaterial color="#1a1530" metalness={0.2} roughness={0.7} emissive="#00fff0" emissiveIntensity={0.06} />
        </mesh>
        <mesh position={[0, 0.043, 0]}>
          <torusGeometry args={[0.062, 0.005, 6, 16]} />
          <meshStandardMaterial color="#0a0814" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.057, 12]} />
          <meshStandardMaterial color="#0a0510" roughness={0.95} />
        </mesh>
        {(
          [
            [0, 0.09, 0, 0.06, 0.13],
            [-0.027, 0.08, 0.027, 0.05, 0.11],
            [0.027, 0.08, -0.027, 0.05, 0.11],
            [0, 0.085, 0.033, 0.045, 0.10],
            [-0.022, 0.08, -0.028, 0.045, 0.095],
          ] as [number, number, number, number, number][]
        ).map((p, i) => (
          <mesh key={`leaf-${i}`} position={[p[0], p[1], p[2]]}>
            <coneGeometry args={[p[3], p[4], 6]} />
            <meshStandardMaterial color="#143a14" emissive="#00ff44" emissiveIntensity={0.25} metalness={0.1} roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
