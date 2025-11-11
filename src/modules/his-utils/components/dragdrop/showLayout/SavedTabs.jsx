//eslint-disable-next-line
// import SavedTabsList from '../Components/SavedTabComponents/SavedTabsList';

import Tab from "./Tab";

export default function SavedTabs() {
  return (
    <section className="SavedTabs">
      {/* <motion.div
        className="SavedTabs__heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackButton />
        <h2 className="SavedTabs__title">Saved Tabs</h2>
      </motion.div> */}

      <div className="SavedTabs__Container">
        {/* <SavedTabsList /> */}
        <SavedTabLayout />
      </div>
    </section>
  );
}

function SavedTabLayout() {
  return (
    <div className="SavedTabs__Container--layout">
      <Tab />
    </div>
  );
}
