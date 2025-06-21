import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useNavigate } from 'react-router-dom';
import { mockExpansions, mockCards, getLocalUserData } from '../mock/mockData';

const Album = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedExpansion, setSelectedExpansion] = useState(null);
  const [userFoundCards, setUserFoundCards] = useState([]);

  useEffect(() => {
    const userData = getLocalUserData();
    setUserFoundCards(userData.foundCards || []);
  }, []);

  const getFoundCardsForExpansion = (expansionId) => {
    return mockCards.filter(card => 
      card.expansionId === expansionId && userFoundCards.includes(card.id)
    );
  };

  const getCompletionPercentage = (expansionId) => {
    const totalCards = mockCards.filter(card => card.expansionId === expansionId).length;
    const foundCards = getFoundCardsForExpansion(expansionId).length;
    return totalCards > 0 ? Math.round((foundCards / totalCards) * 100) : 0;
  };

  if (selectedExpansion) {
    const foundCards = getFoundCardsForExpansion(selectedExpansion.id);
    const allExpansionCards = mockCards.filter(card => card.expansionId === selectedExpansion.id);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setSelectedExpansion(null)}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                ← Torna all'Album
              </Button>
              <h1 className="text-2xl font-bold text-white">
                {selectedExpansion.name}
              </h1>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Home
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">
                Le tue carte: {foundCards.length}/{allExpansionCards.length}
              </h2>
              <Badge 
                className="text-lg px-4 py-2" 
                style={{ backgroundColor: selectedExpansion.color }}
              >
                {getCompletionPercentage(selectedExpansion.id)}% Completato
              </Badge>
            </div>
            <Progress 
              value={getCompletionPercentage(selectedExpansion.id)} 
              className="h-3"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allExpansionCards.map((card) => {
              const isFound = userFoundCards.includes(card.id);
              return (
                <Card 
                  key={card.id}
                  className={`${
                    isFound 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-400/30' 
                      : 'bg-black/40 border-gray-600/30'
                  } backdrop-blur-sm transform transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="p-3">
                    <div className="aspect-[3/4] mb-2 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      {isFound ? (
                        <img 
                          src={card.image} 
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl text-gray-500">❓</div>
                      )}
                    </div>
                    <h3 className={`text-sm font-semibold text-center ${
                      isFound ? 'text-white' : 'text-gray-400'
                    }`}>
                      {isFound ? card.name : '???'}
                    </h3>
                    {isFound && (
                      <Badge variant="secondary" className="w-full mt-2 bg-green-500/20 text-green-300 justify-center">
                        Trovata!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Il tuo Album
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
              {user?.nickname}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Home
            </Button>
            <Button 
              onClick={logout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Le tue Collezioni
          </h2>
          <p className="text-xl text-white/80">
            Esplora le espansioni e scopri tutte le carte che hai collezionato
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockExpansions.map((expansion) => {
            const foundCount = getFoundCardsForExpansion(expansion.id).length;
            const totalCount = mockCards.filter(card => card.expansionId === expansion.id).length;
            const completionPercentage = getCompletionPercentage(expansion.id);

            return (
              <Card 
                key={expansion.id}
                className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => setSelectedExpansion(expansion)}
              >
                <CardHeader className="text-center">
                  <div 
                    className="w-24 h-32 mx-auto mb-4 rounded-lg overflow-hidden transform transition-all duration-300 group-hover:rotate-3"
                    style={{ backgroundColor: expansion.color }}
                  >
                    <img 
                      src={expansion.image} 
                      alt={expansion.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl text-white mb-2">
                    {expansion.name}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {expansion.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Progresso:</span>
                      <Badge 
                        className="text-white"
                        style={{ backgroundColor: expansion.color }}
                      >
                        {foundCount}/{totalCount}
                      </Badge>
                    </div>
                    <Progress 
                      value={completionPercentage} 
                      className="h-2"
                    />
                    <p className="text-center text-white/60 text-sm">
                      {completionPercentage}% Completato
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Overall Stats */}
        <div className="mt-16">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Statistiche Generali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-yellow-400">{userFoundCards.length}</p>
                  <p className="text-white/70">Carte Totali</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-400">{mockExpansions.length}</p>
                  <p className="text-white/70">Espansioni</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">
                    {Math.round((userFoundCards.length / mockCards.length) * 100)}%
                  </p>
                  <p className="text-white/70">Completamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Album;