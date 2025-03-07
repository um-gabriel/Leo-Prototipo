import { TouchableOpacity, TouchableOpacityProps } from "react-native"
import { colors } from "./global"
import { TextInput, TextInputProps } from "react-native"
import { width } from "../firebase/functions/interfaces"

export function Botão({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        height: 60,
        backgroundColor: colors.amarelo2,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
      {...rest}
    />
    
  )
}

export function BotãoInicio({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      style={{
        width: '80%',
        height: 50,
        backgroundColor: colors.amarelo2,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
      {...rest}
    />
  )
}

export function BotãoRedondo({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      style={{
        width: 60,
        height: 60,
        backgroundColor: colors.amarelo1,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
      {...rest}
    />
  )
}

export function InputWhite({ ...rest }: TextInputProps) {
  return (
    <TextInput
      style={{
        width: "90%",
        marginTop: 10,
        height: 50,
        paddingLeft: 20,
        color: "#000",
        borderColor: '#000',
        backgroundColor: "#444",
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
      }}
      {...rest}
    />
  )
}

export function TxtInput({ ...rest }: TextInputProps) {
  return (
    <TextInput
      style={{
        width: '100%',
        height: 55,
        paddingLeft: 30,
        color: colors.tituloBranco,
        borderColor: colors.amarelo2,
        borderWidth: 1.2,
        borderRadius: 8,
        fontSize: 16,

      }}
      {...rest}
    />
  )
}

export function TextArea({ ...rest }: TextInputProps) {
  return (
    <TextInput
      style={{
        color: colors.tituloBranco,
        maxHeight: 1350, // Altura ajustável da área de texto
        borderWidth: 1, // Largura da borda
        maxWidth: "100%",
        //backgroundColor: colors.cinza,
        borderColor: colors.amarelo2,
        borderRadius: 9, // Bordas arredondadas
        padding: 20, // Espaçamento interno
        textAlignVertical: 'center', // Alinha o texto no topo da área de texto
        fontSize: 16, // Tamanho do texto
      }}
      {...rest}
    />
  )
}