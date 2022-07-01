import { v4 as uid } from 'uuid';
import axios from 'axios';
import {useEffect, useState} from 'react';

const instance = axios.create({
  baseURL: "http://localhost:3007",
  timeout: 1000,
  headers: {'Content-Type': 'application/json'}
});

function App() {

  const [pagesList, setPagesList] = useState([]);
  const [finishedPages, setFinishedPages] = useState([]);
  const [finishedComponents, setFinishedComponents] = useState([]);
  const [currentComponent, setCurrentComponent] = useState({name: ''});
  const [componentsList, setComponentsList] = useState([]);

  const getFinishedLists = () => {
    instance.get('finishedPagesList').then(res => {
      setFinishedPages(res.data);
    })
    instance.get('finishedComponents').then(res => {
      setFinishedComponents(res.data);
    })
  };

  useEffect(() => {
    instance.get('/pagesList').then(res => {
      setPagesList(res.data);
    });

    getFinishedLists();
  }, []);

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      setComponentsList((prevComponents) => [...prevComponents, currentComponent]);
      setCurrentComponent({name: ''});
    }
  };

  const list = pagesList.filter((page) => {
    return page.components.every((component) => {
      return componentsList.some((finishedComponent) => {
        return finishedComponent.name === component.name;
      });
    });
  }) || [];

  // TODO: validar que no haya duplicados al guardar
  const handleSave = async () => {
    componentsList.forEach((component) => {
      instance.post('/finishedComponents', {...component, id: uid()});
    })

    setComponentsList([]);

    list.forEach((page) => {
      instance.post('/finishedPagesList', {...page, id: uid()});
    })

    getFinishedLists();
  }

  // useEffect(() => {
  //   const list = ["pdp_hero", "pdp_cards_content", "pdp_list", "pdp_tabs_accordion", "pdp_legal"]
  //   "pdp_cards_content", "pdp_tabs_accordion", "pdp_banner_important", "pdp_advisory_links"
  //
  //   console.log(list.map(value => ({
  //     id: uid(),
  //     name: value,
  //   })))
  //
  //   console.log(uid());
  // }, []);

  return (
    <div>
      <h2 className="text-4xl text-center mt-4">Previews</h2>
      <div className="w-[1200px] text-center mx-auto grid grid-cols-2 gap-x-4 mt-4">
        <div className="border border-sky-500 py-4">
          <h3 className="text-2xl mb-4">Componentes</h3>

          <input
            className="p-1 mb-4 w-10/12 border border-sky-500 rounded-sm focus:outline-none"
            name="currentComponent"
            onChange={(e) => {
              setCurrentComponent({name: e.target.value});
            }}
            value={currentComponent.name}
            onKeyUp={handleKeyUp}
            placeholder="Ingresa un nuevo componente terminado"
            type="text"
          />

          <ul>
            {componentsList.map((component) => (
              <li key={component.id}>
                {component.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-sky-500 py-4">
          <h3 className="text-2xl mb-4">Páginas</h3>
          <ul>
            {list.map((page) => (
              <li key={page.id}>
                {page.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full flex items-center justify-center mt-8">
        <button onClick={handleSave} className="inline-block bg-cyan-500 p-1 rounded-sm transition time-300 active:scale-90">Guardar cambios</button>
      </div>



      <h2 className="text-4xl text-center mt-20">Terminados</h2>
      <div className="w-[1200px] text-center mx-auto grid grid-cols-2 gap-x-4 mt-4">
        <div className="border border-sky-500 py-4">
          <h3 className="text-2xl mb-4">Componentes Terminados</h3>

          <ul>
            {finishedComponents.map((component) => (
              <li key={component.id}>
                {component.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-sky-500 py-4">
          <h3 className="text-2xl mb-4">Páginas Terminadas</h3>
          <ul>
            {finishedPages.map((page) => (
              <li key={page.id}>
                {page.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
