import { useState, useCallback } from "react"
import { 
    View, 
    Text, 
    Image, 
    Modal, 
    Alert,
    FlatList, 
    TouchableOpacity,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { router, useFocusEffect } from "expo-router"

import { style } from "./style"
import { colors } from "@/app/styles/colors"
import { categories } from "@/utils/categories"
import { LinkStorage, linkStorage } from "@/storage/link-storage"

import { Link } from "@/components/link"
import { Option } from "@/components/option"
import { Categories } from "@/components/categories"
import { styles } from "@/components/categories/style"
import { Try } from "expo-router/build/views/Try"

export default function Index(){
    const [links, setlinks] = useState<LinkStorage[]>([])
    const [category, setCategory] = useState(categories[0].name)

    async function getLinks() {
        try {
            const response = await linkStorage.get()

            const filtered = response.filter((link) => link.category === category)
            

            setlinks(filtered)
        } catch (error){
            Alert.alert("Erro", "Não foi possível listar os links")
        }
    }

    useFocusEffect(
        useCallback(() => {
        getLinks()
    }, [category]))

    return (
        <View style={style.container}>
            <View style={style.header}>
                <Image source={require("@/assets/logo.png")} style={style.logo} />

                <TouchableOpacity activeOpacity={0.3} onPress={() => router.navigate("../add")}>
                    <MaterialIcons name="add" size={32} color={colors.green[300]} />
                </TouchableOpacity>
            </View>

            <Categories onchange={setCategory} selected={category}/>


            <FlatList
                data={links}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                <Link
                    name={item.name} 
                    url={item.url} 
                    onDetails={() => console.log("clicou!")} 
                />
            )}
            style={style.links}
            contentContainerStyle={style.linksContent}
            showsVerticalScrollIndicator={false}
         />

         <Modal transparent visible={false}>
            <View style={style.modal}>
                <View style={style.modalContent}>
                    <View style={style.modalHeader}>
                        <Text style={style.modalCategory}>Curso</Text>
                        <TouchableOpacity>
                            <MaterialIcons name="close" size={20} color={colors.gray[400]} />
                        </TouchableOpacity>
                    </View>

                    <Text style={style.modalLinkName}>Rocketseat
                    </Text>

                    <Text style={style.modalUrl}>https://www.rocketseat.com.br/
                    </Text>
                    <View style={style.modalFooter}>
                        <Option name="Excluir" icon="delete" variant="secondary" />
                        <Option name="Abrir" icon="language" />
                    </View>
                </View>
            </View>
         </Modal>
        </View>  
    )
}


