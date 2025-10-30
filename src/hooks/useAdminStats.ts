import { useEffect, useState } from 'react';
import { ApiService } from '../data/api/ApiService';

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
        const service = new ApiService();

        const load = async (): Promise<void> => {
            try {
                const [elections, votes, candidates] = await Promise.all([
                    service.buscarEleicoes(),
                    service.buscarVotos(),
                    service.buscarCandidatos(),
                ]);

                if (isCancelled) return;

                const active = elections.filter(e => e.status === 'ativa').length;

                setActiveElectionsCount(active);
                setTotalCandidatesCount(candidates.length);
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


