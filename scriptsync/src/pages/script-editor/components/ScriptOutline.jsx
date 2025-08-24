import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ScriptOutline = ({ 
  scenes = [],
  characters = [],
  currentScene = null,
  onSceneClick = () => {},
  onCharacterClick = () => {},
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('scenes');

  const mockScenes = [
    {
      id: 1,
      title: "INT. COFFEE SHOP - DAY",
      page: 1,
      lineNumber: 1,
      duration: "2 min",
      characters: ["SARAH", "MIKE"],
      isActive: true
    },
    {
      id: 2,
      title: "EXT. CITY STREET - DAY",
      page: 3,
      lineNumber: 45,
      duration: "1 min",
      characters: ["SARAH"],
      isActive: false
    },
    {
      id: 3,
      title: "INT. SARAH\'S APARTMENT - NIGHT",
      page: 5,
      lineNumber: 78,
      duration: "3 min",
      characters: ["SARAH", "ROOMMATE"],
      isActive: false
    },
    {
      id: 4,
      title: "INT. OFFICE BUILDING - DAY",
      page: 8,
      lineNumber: 112,
      duration: "4 min",
      characters: ["SARAH", "BOSS", "COLLEAGUE"],
      isActive: false
    }
  ];

  // Use provided data or empty arrays for new scripts
  const displayScenes = scenes?.length > 0 ? scenes : [];
  const displayCharacters = characters?.length > 0 ? characters : [];

  const tabs = [
    { id: 'scenes', label: 'Scenes', icon: 'Camera', count: displayScenes?.length },
    { id: 'characters', label: 'Characters', icon: 'Users', count: displayCharacters?.length }
  ];

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 transition-smooth ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="text-sm font-body font-medium">{tab?.label}</span>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              {tab?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'scenes' && (
          <div className="p-3 space-y-2">
            {displayScenes?.map((scene) => (
              <button
                key={scene?.id}
                onClick={() => onSceneClick(scene)}
                className={`w-full p-3 rounded-lg border transition-smooth text-left ${
                  scene?.isActive || scene?.id === currentScene?.id
                    ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-body font-medium line-clamp-2">
                    {scene?.title}
                  </h4>
                  <span className="text-xs text-muted-foreground font-mono ml-2">
                    P{scene?.page}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{scene?.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Users" size={12} />
                      <span>{scene?.characters?.length}</span>
                    </span>
                  </div>
                  <span className="font-mono">#{scene?.lineNumber}</span>
                </div>

                {scene?.characters?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {scene?.characters?.slice(0, 3)?.map((character) => (
                      <span
                        key={character}
                        className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                      >
                        {character}
                      </span>
                    ))}
                    {scene?.characters?.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                        +{scene?.characters?.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="p-3 space-y-3">
            {displayCharacters?.map((character) => (
              <button
                key={character?.name}
                onClick={() => onCharacterClick(character)}
                className="w-full p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-white/5 transition-smooth text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: character?.color }}
                    />
                    <h4 className="text-sm font-body font-medium">
                      {character?.name}
                    </h4>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {character?.scenes} scenes
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {character?.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="MessageSquare" size={12} />
                    <span>{character?.dialogueCount} lines</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="BarChart3" size={12} />
                    <span>Active</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptOutline;