import { Suspense } from "react";
import Layout from "./components/layout/Layout";
import CubeScene from "./components/cube/CubeScene";
import Controls from "./components/ui/Controls";
import ProgressBar from "./components/ui/ProgressBar";
import SpeedSlider from "./components/ui/SpeedSlider";
import SolverPanel from "./components/solver/SolverPanel";
import { useAnimationPlayer } from "./hooks/useAnimationPlayer";

const FaceLegend = () => (
  <div className="bg-white rounded-lg shadow-lg p-4">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">
      Repères des faces
    </h3>
    <div className="grid grid-cols-3 gap-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-white border border-gray-300" />
        U: Up (haut)
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-yellow-300" />
        D: Down (bas)
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-red-400" />
        F: Front (avant)
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-orange-400" />
        B: Back (arrière)
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-green-400" />
        L: Left (gauche)
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-blue-400" />
        R: Right (droite)
      </div>
    </div>
  </div>
);

function App() {
  useAnimationPlayer(); // Démarrer le lecteur d'animation

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
        {/* Zone du cube 3D */}
        <div className="flex-1 min-h-[400px] lg:min-h-full bg-gray-100 rounded-lg shadow-lg overflow-hidden">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                Chargement du cube...
              </div>
            }
          >
            <CubeScene />
          </Suspense>
        </div>

        {/* Panneau latéral */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          {/* Panneau de résolution */}
          <SolverPanel />

          {/* Barre de progression */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <ProgressBar />
          </div>

          {/* Slider de vitesse */}
          <SpeedSlider />

          {/* Légende des faces */}
          <FaceLegend />

          {/* Contrôles */}
          <Controls />
        </div>
      </div>
    </Layout>
  );
}

export default App;
