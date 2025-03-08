import { collection, getDocs, query, where } from "firebase/firestore";
import { verification } from "../interface";
import { db } from "../../config";

export async function dados_usuario(passData) {
    const {setUsersData, setFilteredUsersData, setTipoConta, setLoading } = passData
    const userAuth = verification();
    if (!userAuth.isAuthenticated) {
      console.error("User is not authenticated");
      setLoading(false);
      return;
    }
    try {
      const q = query(
        collection(db, "Contas"),
        where("uid", "==", userAuth.uid)
      );
      const querySnapshot = await getDocs(q);      
      const usersDataArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsersData(usersDataArray);
      setFilteredUsersData(usersDataArray);

      if (usersDataArray.length > 0) {
        setTipoConta(usersDataArray[0].tipo_conta);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };