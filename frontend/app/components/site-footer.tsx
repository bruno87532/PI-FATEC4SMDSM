import Link from "next/link"

export const SiteFooter = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4">

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2">
            </div>
            <p className="text-sm text-gray-600">
              © 2024 Preços do mercado. Todos os direitos reservados. <br />
              CNPJ: 00.000.000/0001-00 | Av. Example, 1000 - Campinas/SP
            </p>
            <div className="text-sm text-gray-500">
              Desenvolvido por{" "}
              <Link href="#" className="text-green-600 hover:underline">
                Bruno
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

