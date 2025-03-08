import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormMessage, FormControl, FormLabel, FormItem, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formeSchema = z.object({
  name: z.string().length(2, "Informe um nome válido"),
  email: z.string().email("Informe um email válido")
})

type FormValues = z.infer<typeof formeSchema>

const onSubmit = () => {
  
}

export const AuthLogin = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formeSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  })
  
  return (
    <div>
      <Form { ...form }>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o seu nome" { ...field } />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o seu email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            Enviar
          </Button>
        </form>
      </Form>
    </div>
  )
}