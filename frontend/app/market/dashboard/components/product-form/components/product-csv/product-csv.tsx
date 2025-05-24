"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, AlertCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { productService } from "@/services/product"

export const ProductCsv = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProcessingMessage, setShowProcessingMessage] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && (selectedFile.type === "text/csv" || selectedFile.type === "application/vnd.ms-excel")) {
      setFile(selectedFile)
    } else {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive",
      })
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsProcessing(true)
    setShowProcessingMessage(true)

    toast({
      title: "Processamento iniciado",
      description:
        "O processo de importação foi iniciado. Isso pode levar alguns minutos. Você receberá um email com o relatório quando finalizado.",
      duration: 10000,
    })

    try {
      productService.csv(file)
      setIsOpen(false)
      setFile(null)
      setShowProcessingMessage(false)
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
      setShowProcessingMessage(false)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importar Produtos via CSV
          </DialogTitle>
          <DialogDescription>Importe múltiplos produtos de uma vez usando um arquivo CSV</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {showProcessingMessage && (
            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Processamento em andamento...</strong> Este processo pode levar alguns minutos dependendo do
                tamanho do arquivo. Quando finalizado, você receberá um email com o relatório detalhado da importação.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> As categorias e subcategorias ficarão como "sem categoria" inicialmente, mas
              podem ser atualizadas posteriormente. As imagens ficarão em branco e também podem ser adicionadas depois.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-semibold">Estrutura do CSV</h4>
            <p className="text-sm text-muted-foreground">O arquivo CSV deve conter exatamente as seguintes colunas:</p>

            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-green-600">Colunas Obrigatórias:</h5>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>
                      <code>name</code> - Nome do produto
                    </li>
                    <li>
                      <code>regularPrice</code> - Preço regular (número - 1 = 0,01)
                    </li>
                    <li>
                      <code>stock</code> - Estoque (número)
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600">Colunas Opcionais:</h5>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>
                      <code>description</code> - Descrição
                    </li>
                    <li>
                      <code>promotionalPrice</code> - Preço promocional (número - 1 = 0,01)
                    </li>
                    <li>
                      <code>promotionStart</code> - Início da promoção (YYYY-MM-DD)
                    </li>
                    <li>
                      <code>promotionExpiration</code> - Fim da promoção (YYYY-MM-DD)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Regra importante:</strong> Se você informar um preço promocional, deve obrigatoriamente informar
                as datas de início e fim da promoção.
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Selecionar Arquivo</h4>
            <div className="space-y-2">
              <Label htmlFor="csv-file">Arquivo CSV</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} disabled={isProcessing} />
            </div>

            {file && !isProcessing && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <FileText className="h-4 w-4" />
                {file.name} selecionado
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button onClick={handleImport} disabled={!file || isProcessing} className="gap-2">
              {isProcessing && <Upload className="h-4 w-4 animate-spin" />}
              {isProcessing ? "Processando..." : "Importar Produtos"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
