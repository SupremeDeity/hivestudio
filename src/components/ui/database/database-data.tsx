import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function DatabaseData({
  tabs,
  activeTab,
  setActiveTab,
  closeTab,
}: {
  tabs: { name: string }[];
  activeTab: string | null;
  setActiveTab: (tabName: string) => void;
  closeTab: (tabName: string) => void;
}) {
  return (
    <Tabs value={activeTab || ""} onValueChange={setActiveTab}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.name} value={tab.name}>
            {tab.name}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering tab switch
                closeTab(tab.name);
              }}
              className="ml-2 text-red-500"
            >
              x
            </button>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.name} value={tab.name}>
          <h2>{tab.name}</h2>
          {/* Render table rows or other content here */}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default DatabaseData;
