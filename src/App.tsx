import { Suspense, useState } from "react";
import Layout from "./components/layout/Layout";
import CubeEditor from "./components/cube/CubeEditor";
import CubeScene from "./components/cube/CubeScene";
import Controls from "./components/ui/Controls";
import ProgressBar from "./components/ui/ProgressBar";
import SpeedSlider from "./components/ui/SpeedSlider";
import SolverPanel from "./components/solver/SolverPanel";
import { useAnimationPlayer } from "./hooks/useAnimationPlayer";
import { useSolver } from "./hooks/useSolver";
import { useCubeStore } from "./store/cubeStore";

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
        <span className="inline-block w-3 h-3 rounded-full bg-green-400" />
        F: Front (avant)
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-blue-400" />
        B: Back (arrière)
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-orange-400" />
        L: Left (gauche)
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-red-400" />
        R: Right (droite)
      </div>
    </div>
  </div>
);

function App() {
  useAnimationPlayer(); // Démarrer le lecteur d'animation
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { method } = useSolver();

  const handleEditorConfirm = () => {
    setIsEditorOpen(false);
    void useCubeStore.getState().startSolve(method);
  };

  return (
    <Layout>
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-3 sm:p-4 xl:grid xl:grid-cols-[minmax(0,1fr)_24rem]">
        {/* Zone du cube 3D */}
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-slate-100 shadow-lg">
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
        <div className="flex w-full min-h-0 flex-col gap-4 overflow-y-auto xl:min-w-0 xl:pl-0">
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
          <Controls onEditCube={() => setIsEditorOpen(true)} />
        </div>
      </div>

      {isEditorOpen && (
        <CubeEditor
          onCancel={() => setIsEditorOpen(false)}
          onConfirm={handleEditorConfirm}
        />
      )}
    </Layout>
  );
}

export default App;
