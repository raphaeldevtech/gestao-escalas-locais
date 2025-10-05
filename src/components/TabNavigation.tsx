import { Users, MapPin, Calendar, LayoutGrid } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="bg-card border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full justify-start h-14 bg-transparent border-0">
            <TabsTrigger 
              value="obreiros" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary flex gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Obreiros</span>
            </TabsTrigger>
            <TabsTrigger 
              value="locais"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary flex gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Locais</span>
            </TabsTrigger>
            <TabsTrigger 
              value="gerar"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary flex gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Gerar Escala</span>
            </TabsTrigger>
            <TabsTrigger 
              value="visualizar"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary flex gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Visualizar</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
