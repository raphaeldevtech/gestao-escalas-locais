import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { ObreirosTab } from '@/components/ObreirosTab';
import { LocaisTab } from '@/components/LocaisTab';
import { GerarEscalaTab } from '@/components/GerarEscalaTab';
import { VisualizarEscalaTab } from '@/components/VisualizarEscalaTab';
import { DadosTab } from '@/components/DadosTab';
import { storageService } from '@/lib/storage';
import { Obreiro, LocalCulto, Escala } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('obreiros');
  const [obreiros, setObreiros] = useState<Obreiro[]>([]);
  const [locais, setLocais] = useState<LocalCulto[]>([]);
  const [escalas, setEscalas] = useState<Escala[]>([]);

  const loadData = () => {
    setObreiros(storageService.getObreiros());
    setLocais(storageService.getLocais());
    setEscalas(storageService.getEscalas());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEscalaGerada = () => {
    loadData();
    setActiveTab('visualizar');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'obreiros' && (
          <ObreirosTab obreiros={obreiros} onUpdate={loadData} />
        )}
        {activeTab === 'locais' && (
          <LocaisTab locais={locais} onUpdate={loadData} />
        )}
        {activeTab === 'gerar' && (
          <GerarEscalaTab
            obreiros={obreiros}
            locais={locais}
            onEscalaGerada={handleEscalaGerada}
          />
        )}
        {activeTab === 'visualizar' && (
          <VisualizarEscalaTab escalas={escalas} onUpdate={loadData} />
        )}
        {activeTab === 'dados' && (
          <DadosTab onUpdate={loadData} />
        )}
      </main>
    </div>
  );
};

export default Index;
