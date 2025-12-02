import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import KanbanView from './views/KanbanView';
import ListView from './views/ListView';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<KanbanView />} />
          <Route path="/list" element={<ListView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

