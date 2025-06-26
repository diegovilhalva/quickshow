import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/KConverter';
import axios from 'axios';
import { API_KEY, apiEndpoint, TMDB_BASE_URL } from '../../lib/constants';
import toast from 'react-hot-toast';

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [showPrice, setShowPrice] = useState('');
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Busca filmes no TMDB
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
          params: { api_key: API_KEY, language: 'pt-BR', region: 'BR' }
        });
        setNowPlayingMovies(data.results);
      } catch (err) {
        console.error(err);
        toast.error('Falha ao carregar filmes.');
      } finally {
        setLoadingMovies(false);
      }
    })();
  }, []);

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;

    // Cria um objeto Date a partir do input (já considera o fuso local)
    const localDateTime = new Date(dateTimeInput);

    // Formata a data como YYYY-MM-DD no fuso local
    const date = localDateTime.toLocaleDateString('en-CA'); // Formato ISO (YYYY-MM-DD)

    // Formata a hora como HH:MM no fuso local
    const time = localDateTime.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    setDateTimeSelection(prev => {
      const times = prev[date] || [];
      if (!times.includes(time)) return { ...prev, [date]: [...times, time] };
      return prev;
    });
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection(prev => {
      const filtered = prev[date].filter(t => t !== time);
      if (!filtered.length) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filtered };
    });
  };

  const handleAddShow = async () => {
    if (!selectedMovie) return toast.error('Selecione um filme');
    if (!showPrice) return toast.error('Defina o preço do ingresso');
    if (!Object.keys(dateTimeSelection).length) return toast.error('Adicione ao menos uma data/hora');

    const showsInput = Object.entries(dateTimeSelection).map(([date, times]) => ({ date, times }));

    setSubmitting(true);
    try {
      const res = await axios.post(`${apiEndpoint}/show/create`, {
        movieId: selectedMovie,
        showPrice: Number(showPrice),
        showsInput
      });
      toast.success(res.data.message);
      // limpa formulário
      setSelectedMovie(null);
      setShowPrice('');
      setDateTimeSelection({});
      setDateTimeInput('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Erro ao salvar sessões');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMovies) return <Loading />;

  return (
    <>
      <Title text1="Adicionar" text2="Sessões" />

      <section className="mt-10">
        <h2 className="text-lg font-medium mb-4">Filmes em cartaz</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4">
            {nowPlayingMovies.map(movie => (
              <div
                key={movie.id}
                className={`w-40 cursor-pointer p-1 rounded-lg transition ${selectedMovie === movie.id
                  ? 'ring-2 ring-primary'
                  : 'hover:ring-1 hover:ring-primary/50'
                  }`}
                onClick={() => setSelectedMovie(movie.id)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded"
                />
                <div className="flex justify-between items-center mt-1 text-sm text-gray-400">
                  <span>{kConverter(movie.vote_count)} votos</span>
                  <span className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <label className="block text-sm font-medium mb-2">Preço do ingresso</label>
        <div className="inline-flex items-center gap-2 border px-3 py-2 rounded-md">
          <span className="text-gray-400">{currency}</span>
          <input
            type="number"
            min="0"
            value={showPrice}
            onChange={e => setShowPrice(e.target.value)}
            className="outline-none w-24"
            placeholder="00.00"
          />
        </div>
      </section>

      <section className="mt-6">
        <label className="block text-sm font-medium mb-2">Selecionar data e hora</label>
        <div className="inline-flex gap-2 items-center border px-3 py-2 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={e => setDateTimeInput(e.target.value)}
            className="outline-none"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dull"
          >
            Adicionar
          </button>
        </div>
      </section>

      {Object.keys(dateTimeSelection).length > 0 && (
        <section className="mt-6">
          <h2 className="font-medium mb-2">Datas e horários adicionados</h2>
          <div className="space-y-2">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <div key={date}>
                <div className="font-semibold">
                  {date.split('-').reverse().join('/')} {/* Formata para DD/MM/YYYY */}
                </div>
                <div className="flex gap-2 mt-1">
                  {times.map(time => (
                    <div
                      key={time}
                      className="flex items-center gap-1 border px-2 py-1 rounded"
                    >
                      <span>{time}</span>
                      <DeleteIcon
                        onClick={() => handleRemoveTime(date, time)}
                        className="w-4 h-4 text-red-500 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <button
        disabled={submitting}
        onClick={handleAddShow}
        className={`mt-8 px-6 py-2 rounded-md text-white ${submitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-dull'
          }`}
      >
        {submitting ? 'Salvando...' : 'Add Show'}
      </button>
    </>
  );
};

export default AddShows;
