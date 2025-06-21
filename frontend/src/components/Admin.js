import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { mockExpansions, mockCards } from '../mock/mockData';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [expansions, setExpansions] = useState(mockExpansions);
  const [cards, setCards] = useState(mockCards);
  const [users, setUsers] = useState([
    { id: 1, email: 'admin@example.com', nickname: 'Admin', isAdmin: true },
    { id: 2, email: 'user@example.com', nickname: 'User1', isAdmin: false },
    { id: 3, email: 'test@example.com', nickname: 'TestUser', isAdmin: false }
  ]);

  // Form states
  const [expansionForm, setExpansionForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });
  const [cardForm, setCardForm] = useState({
    name: '',
    expansionId: '',
    image: null
  });
  const [editingExpansion, setEditingExpansion] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  // Check if user is admin
  const isAdmin = user?.isAdmin || user?.email === 'admin@example.com';

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Accesso negato",
        description: "Non hai i permessi per accedere a questa pagina",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, navigate, toast]);

  if (!isAdmin) {
    return null;
  }

  const handleExpansionSubmit = (e) => {
    e.preventDefault();
    
    if (editingExpansion) {
      // Update existing expansion
      setExpansions(expansions.map(exp => 
        exp.id === editingExpansion.id 
          ? { ...exp, ...expansionForm }
          : exp
      ));
      setEditingExpansion(null);
      toast({
        title: "Espansione aggiornata",
        description: `${expansionForm.name} è stata aggiornata con successo`,
      });
    } else {
      // Create new expansion
      const newExpansion = {
        id: Date.now(),
        ...expansionForm,
        totalCards: 0,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzNiODJmNiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K"
      };
      setExpansions([...expansions, newExpansion]);
      toast({
        title: "Espansione creata",
        description: `${expansionForm.name} è stata creata con successo`,
      });
    }
    
    setExpansionForm({ name: '', description: '', color: '#3b82f6' });
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    
    if (!cardForm.expansionId) {
      toast({
        title: "Errore",
        description: "Seleziona un'espansione per la carta",
        variant: "destructive",
      });
      return;
    }

    if (editingCard) {
      // Update existing card
      setCards(cards.map(card => 
        card.id === editingCard.id 
          ? { ...card, name: cardForm.name, expansionId: parseInt(cardForm.expansionId) }
          : card
      ));
      setEditingCard(null);
      toast({
        title: "Carta aggiornata",
        description: `${cardForm.name} è stata aggiornata con successo`,
      });
    } else {
      // Create new card
      const newCard = {
        id: Date.now(),
        name: cardForm.name,
        expansionId: parseInt(cardForm.expansionId),
        image: cardForm.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI1MCIgeT0iODAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjZTVlN2ViIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4KPC9zdmc+"
      };
      setCards([...cards, newCard]);
      
      // Update expansion total cards count
      setExpansions(expansions.map(exp => 
        exp.id === parseInt(cardForm.expansionId)
          ? { ...exp, totalCards: exp.totalCards + 1 }
          : exp
      ));
      
      toast({
        title: "Carta creata",
        description: `${cardForm.name} è stata creata con successo`,
      });
    }
    
    setCardForm({ name: '', expansionId: '', image: null });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardForm({ ...cardForm, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteExpansion = (id) => {
    setExpansions(expansions.filter(exp => exp.id !== id));
    setCards(cards.filter(card => card.expansionId !== id));
    toast({
      title: "Espansione eliminata",
      description: "L'espansione e tutte le sue carte sono state eliminate",
    });
  };

  const deleteCard = (id) => {
    const card = cards.find(c => c.id === id);
    setCards(cards.filter(c => c.id !== id));
    
    // Update expansion total cards count
    if (card) {
      setExpansions(expansions.map(exp => 
        exp.id === card.expansionId
          ? { ...exp, totalCards: Math.max(0, exp.totalCards - 1) }
          : exp
      ));
    }
    
    toast({
      title: "Carta eliminata",
      description: "La carta è stata eliminata con successo",
    });
  };

  const toggleUserAdmin = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, isAdmin: !u.isAdmin }
        : u
    ));
    const user = users.find(u => u.id === userId);
    toast({
      title: `Ruolo aggiornato`,
      description: `${user.nickname} è ora ${user.isAdmin ? 'utente normale' : 'amministratore'}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <Badge variant="destructive" className="bg-red-500/20 text-red-300">
              🔒 Amministratore
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

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="expansions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="expansions" className="text-white">Espansioni</TabsTrigger>
            <TabsTrigger value="cards" className="text-white">Carte</TabsTrigger>
            <TabsTrigger value="users" className="text-white">Utenti</TabsTrigger>
          </TabsList>

          {/* Expansions Tab */}
          <TabsContent value="expansions" className="space-y-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingExpansion ? 'Modifica Espansione' : 'Nuova Espansione'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExpansionSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="exp-name" className="text-white">Nome</Label>
                    <Input
                      id="exp-name"
                      value={expansionForm.name}
                      onChange={(e) => setExpansionForm({...expansionForm, name: e.target.value})}
                      placeholder="Nome dell'espansione"
                      required
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exp-desc" className="text-white">Descrizione</Label>
                    <Textarea
                      id="exp-desc"
                      value={expansionForm.description}
                      onChange={(e) => setExpansionForm({...expansionForm, description: e.target.value})}
                      placeholder="Descrizione dell'espansione"
                      className="bg-white/10 border-white/20 text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exp-color" className="text-white">Colore</Label>
                    <Input
                      id="exp-color"
                      type="color"
                      value={expansionForm.color}
                      onChange={(e) => setExpansionForm({...expansionForm, color: e.target.value})}
                      className="bg-white/10 border-white/20 h-12"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600">
                      {editingExpansion ? 'Aggiorna' : 'Crea'} Espansione
                    </Button>
                    {editingExpansion && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setEditingExpansion(null);
                          setExpansionForm({ name: '', description: '', color: '#3b82f6' });
                        }}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Annulla
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expansions.map((expansion) => (
                <Card key={expansion.id} className="bg-black/20 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{expansion.name}</CardTitle>
                        <CardDescription className="text-white/70">{expansion.description}</CardDescription>
                      </div>
                      <Badge style={{ backgroundColor: expansion.color }} className="text-white">
                        {cards.filter(c => c.expansionId === expansion.id).length} carte
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingExpansion(expansion);
                          setExpansionForm({
                            name: expansion.name,
                            description: expansion.description,
                            color: expansion.color
                          });
                        }}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Modifica
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteExpansion(expansion.id)}
                      >
                        Elimina
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingCard ? 'Modifica Carta' : 'Nuova Carta'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="card-name" className="text-white">Nome</Label>
                    <Input
                      id="card-name"
                      value={cardForm.name}
                      onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
                      placeholder="Nome della carta"
                      required
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-expansion" className="text-white">Espansione</Label>
                    <Select value={cardForm.expansionId.toString()} onValueChange={(value) => setCardForm({...cardForm, expansionId: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Seleziona espansione" />
                      </SelectTrigger>
                      <SelectContent>
                        {expansions.map((expansion) => (
                          <SelectItem key={expansion.id} value={expansion.id.toString()}>
                            {expansion.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="card-image" className="text-white">Immagine (JPEG)</Label>
                    <Input
                      id="card-image"
                      type="file"
                      accept="image/jpeg"
                      onChange={handleImageUpload}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    {cardForm.image && (
                      <div className="mt-2">
                        <img src={cardForm.image} alt="Preview" className="w-24 h-32 object-cover rounded" />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">
                      {editingCard ? 'Aggiorna' : 'Crea'} Carta
                    </Button>
                    {editingCard && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setEditingCard(null);
                          setCardForm({ name: '', expansionId: '', image: null });
                        }}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Annulla
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cards.map((card) => {
                const expansion = expansions.find(e => e.id === card.expansionId);
                return (
                  <Card key={card.id} className="bg-black/20 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-2">{card.name}</h3>
                      <Badge 
                        className="text-xs mb-3"
                        style={{ backgroundColor: expansion?.color }}
                      >
                        {expansion?.name}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCard(card);
                            setCardForm({
                              name: card.name,
                              expansionId: card.expansionId.toString(),
                              image: card.image
                            });
                          }}
                          className="border-white/30 text-white hover:bg-white/10 text-xs"
                        >
                          Modifica
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCard(card.id)}
                          className="text-xs"
                        >
                          Elimina
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Gestione Utenti</CardTitle>
                <CardDescription className="text-white/70">
                  Gestisci i permessi di amministratore per gli utenti registrati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h3 className="text-white font-semibold">{user.nickname}</h3>
                        <p className="text-white/70 text-sm">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={user.isAdmin ? "destructive" : "secondary"}>
                          {user.isAdmin ? "Admin" : "Utente"}
                        </Badge>
                        <Button
                          size="sm"
                          variant={user.isAdmin ? "outline" : "default"}
                          onClick={() => toggleUserAdmin(user.id)}
                          className={user.isAdmin 
                            ? "border-white/30 text-white hover:bg-white/10" 
                            : "bg-gradient-to-r from-red-500 to-pink-600"
                          }
                        >
                          {user.isAdmin ? "Rimuovi Admin" : "Rendi Admin"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;