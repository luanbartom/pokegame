import { useRouter } from 'next/router';
export default function Home() {
  const router = useRouter();
  return (
    <div className="container">
      <h1>Bem-vindo ao Sistema de Batalhas Pokémon</h1>
      <button onClick={() => router.push('/select-team')} className="btn">
        Começar
      </button>
    </div>
  );
}