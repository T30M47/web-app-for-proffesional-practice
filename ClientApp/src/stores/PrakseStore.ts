import { makeAutoObservable } from "mobx";
import api from "../api/api";
import { router } from "../components/main/Routes";
import { RequestPractice } from "../types/practices/requests/RequestPractice";
import { ResponsePractice } from "../types/practices/responses/ResponsePractice";
import { v4 as uuid } from 'uuid';

export default class PrakseStore {
    prakseRegistry = new Map<string, ResponsePractice>();
    fetchedPrakse: boolean = false;
    selectedPraksa: ResponsePractice | undefined = undefined;
    isloading: boolean = false;
    isFetchingPractice: boolean = false;


    constructor() {
        makeAutoObservable(this);
    }

    get prakse() {
        return Array.from(this.prakseRegistry.values());
    }

    setSelectedPraksa(praksa: ResponsePractice | undefined) {
        this.selectedPraksa = praksa;
    }

    setFetchedPrakse(state: boolean) {
        this.fetchedPrakse = state;
    }

    novaPraksa() {
        this.setSelectedPraksa(undefined);
        router.navigate("/prakse/nova");
    }

    private setirajPrakse(prakse: ResponsePractice[]) {
        this.prakseRegistry.clear();
        prakse.forEach((praksa) => {
            this.prakseRegistry.set(praksa.id_practice, praksa);
        });
    }

    private dodajPraksu(praksa: ResponsePractice) {
        this.prakseRegistry.set(praksa.id_practice, praksa);
    }

    private updatePraksu(praksa: ResponsePractice) {
        this.prakseRegistry.set(praksa.id_practice, praksa);
    }

    private deletePraksu(id_practice: string) {
        this.prakseRegistry.delete(id_practice);
    }

    private setIsLoading(state: boolean) {
        this.isloading = state;
    }

    private setIsFetchingPractice(state: boolean) {
        this.isFetchingPractice = state;
    }

    async GetAll() {
        try {
            this.setIsLoading(true);
            this.setirajPrakse([]);
            const data = await api.practices.GetAll();
            this.setirajPrakse(data);
            this.setFetchedPrakse(true);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsLoading(false);
        }
    };

    async SelectPraksa(id_practice: string) {
        try {
            let praksa = this.prakse.find((x) => x.id_practice === id_practice);
            if (!praksa) {
                this.setIsFetchingPractice(true);
                praksa = await api.practices.GetPractice(id_practice);
            }
            this.setSelectedPraksa(praksa);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsFetchingPractice(false);
        }
    }

    async CreateOrUpdate(id_practice: string | undefined, praksa: RequestPractice): Promise<boolean> {
        if (id_practice !== undefined) {
            let practice = praksa as RequestPractice;
            practice.id_practice = id_practice;
            return await this.UpdatePraksu(id_practice, practice)
        } else {
            return await this.DodajPraksu(praksa as RequestPractice);
        }
    }

    async DodajPraksu(praksa: RequestPractice): Promise<boolean> {
        try {
            praksa.id_practice = uuid();
            this.setIsLoading(true);
            const novaPraksa = await api.practices.AddPractice(praksa);
            if (novaPraksa) {
                this.dodajPraksu(novaPraksa);
                return true;
            }
            return false;
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    async UpdatePraksu(id_practice: string, praksa: RequestPractice): Promise<boolean> {
        try {
            this.setIsLoading(true);
            const res = await api.practices.UpdatePractice(id_practice, praksa);
            if (res) {
                this.updatePraksu(res.data);
                return true;
            }
            return false;
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    async DeletePraksu(id_practice: string) {
        try {
            this.setIsLoading(true);
            await api.practices.RemovePractice(id_practice);
            this.deletePraksu(id_practice);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsLoading(false);
        }
    };
}
