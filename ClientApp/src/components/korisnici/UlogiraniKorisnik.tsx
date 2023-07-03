import { observer } from "mobx-react-lite";
import  {  useEffect } from "react";
import { useStore } from "../../store";
import Loading from "../lib/Loading";
import { Rola } from "../../types/enums/Rola";



function UlogiraniKorisnik() {
    const { korisniciStore } = useStore();
    const { currentUserStore } = useStore();
    const korisnik = currentUserStore.korisnik;

    useEffect(() =>{
        const user = async () => {
            if (korisnik?.user_id) { await korisniciStore.SelectKorisnik(korisnik.user_id) };
        };
        user();
    }, [korisnik?.user_id, korisniciStore]);

    


    //render
    if (korisniciStore.isFetchingUser && korisniciStore.selectedKorisnik === undefined) return <Loading text="Dohvaćamo podatke..." />

    return (
     
        <div>
            <h2>Pozdrav, {korisniciStore.selectedKorisnik?.username}</h2>
            <h1>Vaši podaci:</h1>
            <p>Ime: <strong>{korisniciStore.selectedKorisnik?.name}</strong></p>
            <p>Prezime: <strong>{korisniciStore.selectedKorisnik?.surname}</strong></p>
            <p>E-mail: <strong>{korisniciStore.selectedKorisnik?.email}</strong></p>
            {korisniciStore.selectedKorisnik?.role.includes(Rola.Student) && (
                <p>JMBAG: <strong>{korisniciStore.selectedKorisnik?.jmbag}</strong></p>
            )}
            <p>Role: <strong>{korisniciStore.selectedKorisnik?.role.join(', ')}</strong></p>
            </div>

    )
}

export default observer(UlogiraniKorisnik);
