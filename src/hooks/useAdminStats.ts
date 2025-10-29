import { useEffect, useState } from 'react';
import { MockApiService } from '../data/api/MockApiService';

interface AdminStatsState {
    activeElectionsCount: number;
    totalCandidatesCount: number;
    totalVotesCount: number;
    isLoading: boolean;
}

export function useAdminStats(cpf?: string): AdminStatsState {
    const [activeElectionsCount, setActiveElectionsCount] = useState<number>(0);
    const [totalCandidatesCount, setTotalCandidatesCount] = useState<number>(0);
    const [totalVotesCount, setTotalVotesCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isCancelled = false;
        const service = new MockApiService();

        const load = async (): Promise<void> => {
            try {
                const [elections, votes] = await Promise.all([
                    service.buscarEleicoes(),
                    service.buscarMeusVotos(cpf ?? '000.000.000-00')
                ]);

                if (isCancelled) return;

                const active = elections.filter(e => e.status === 'ativa').length;
                const candidates = elections.reduce((sum, election) => {
                    return sum + election.categorias.reduce((inner, cat) => inner + cat.candidatos.length, 0);
                }, 0);

                setActiveElectionsCount(active);
                setTotalCandidatesCount(candidates);
                setTotalVotesCount(votes.length);
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        void load();
        return () => {
            isCancelled = true;
        };
    }, [cpf]);

    return { activeElectionsCount, totalCandidatesCount, totalVotesCount, isLoading };
}


