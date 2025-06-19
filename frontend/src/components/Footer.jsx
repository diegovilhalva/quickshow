
import React from 'react'
import { assets } from "../assets/assets"

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 mt-40 lg:px-36 w-full text-gray-200">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
        <div className="md:max-w-96">
          <img className="w-36 h-auto" src={assets.logo} alt="logo QuickShow" />
          <p className="mt-6 text-sm">
            O QuickShow é sua plataforma confiável para comprar ingressos de cinema de forma rápida, prática e segura. Curta os melhores lançamentos com apenas alguns cliques.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg"
                alt="Baixar na Google Play"
                className="h-10 w-auto border border-white rounded hover:opacity-80 transition"
              />
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg"
                alt="Baixar na App Store"
                className="h-10 w-auto border border-white rounded hover:opacity-80 transition"
              />
            </a>
          </div>
        </div>

        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Links</h2>
            <ul className="text-sm space-y-2">
              <li><a href="/" className="hover:underline transition">Início</a></li>
              <li><a href="/movies" className="hover:underline transition">Filmes</a></li>
              <li><a href="#" className="hover:underline transition">Cinemas</a></li>
              <li><a href="#" className="hover:underline transition">Lançamentos</a></li>
              <li><a href="/favorite" className="hover:underline transition">Favoritos</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-5">Contato</h2>
            <div className="text-sm space-y-2">
              <p className="hover:underline transition cursor-default">+55 21 3360-8900</p>
              <p className="hover:underline transition cursor-default">contato@quickshow.com</p>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-4 text-center text-sm pb-5 text-gray-400">
        © {new Date().getFullYear()} QuickShow — Todos os direitos reservados.
      </p>
    </footer>
  )
}

export default Footer
