import { useTabContext } from "@/context/database/TabContext";

function Database() {
  const { activeTab } = useTabContext();

  if (!activeTab) {
    return <h2>Select a table to view its content</h2>;
  }

  return (
    <div>
      <h2>Table: {activeTab}</h2>
      {/* Render table rows or other content here */}
    </div>
  );
}

export default Database;