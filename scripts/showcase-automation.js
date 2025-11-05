import puppeteer from 'puppeteer';

// Configurações
const BASE_URL = 'http://localhost:3000'; // Ajuste conforme necessário
const ADMIN_CPF = '11111111111';
const ADMIN_SENHA = 'superadmin';
const ELEITOR_CPF = '33333333333';
const ELEITOR_SENHA = '123';

// Função para formatar data no formato brasileiro (DD/MM/YYYY HH:mm)
function formatarDataHoraBR(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

// Função helper para aguardar tempo
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para aguardar elemento aparecer
async function waitForElement(page, selector, timeout = 10000) {
    try {
        await page.waitForSelector(selector, { timeout, visible: true });
        return true;
    } catch (error) {
        console.log(`Elemento não encontrado: ${selector}`);
        return false;
    }
}

// Função para aguardar navegação
async function waitForNavigation(page) {
    try {
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    } catch (error) {
        // Ignora timeout se a página já estiver carregada
    }
}

async function runShowcase() {
    console.log('🚀 Iniciando automação do showcase...\n');

    const browser = await puppeteer.launch({
        headless: false, // Mostra o navegador para visualização
        slowMo: 100, // Desacelera ações em 100ms para melhor visualização
        defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();

    try {
        // ============================================
        // 1. LOGIN COMO ADMIN
        // ============================================
        console.log('📝 Passo 1: Fazendo login como admin...');
        await page.goto(`${BASE_URL}/login`);
        await page.waitForSelector('input[type="text"]', { visible: true });

        // Preencher CPF
        const cpfInput = await page.$('input[type="text"]');
        await cpfInput.click({ clickCount: 3 }); // Seleciona todo o texto
        await cpfInput.type(ADMIN_CPF);

        // Preencher senha
        const senhaInput = await page.$('input[type="password"]');
        await senhaInput.click({ clickCount: 3 });
        await senhaInput.type(ADMIN_SENHA);

        // Clicar em entrar
        await page.click('button[type="submit"]');
        await waitForNavigation(page);
        await delay(2000);
        console.log('✅ Login como admin realizado\n');

        // ============================================
        // 2. CRIAR ELEIÇÃO
        // ============================================
        console.log('📝 Passo 2: Criando eleição...');
        // Aguardar carregar o dashboard após login
        await delay(2000);

        // Clicar no botão "Eleições" no menu de navegação
        const eleicoesFound = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent?.trim() === 'Eleições');
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (eleicoesFound) {
            await delay(2000);
        } else {
            console.log('⚠️ Botão "Eleições" não encontrado no menu, tentando navegar diretamente...');
            await page.goto(`${BASE_URL}/admin/eleicoes`);
            await delay(2000);
        }

        // Clicar no botão "Nova Eleição"
        const novaEleicaoFound = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => {
                const text = b.textContent?.trim();
                return text.includes('Nova Eleição') || (text.includes('Novo') && text.includes('Eleição'));
            });
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (novaEleicaoFound) {
            await delay(2000);
        } else {
            console.log('⚠️ Botão de criar eleição não encontrado, tentando navegar diretamente...');
            await page.goto(`${BASE_URL}/admin/eleicoes/criar`);
            await delay(2000);
        }

        // Preencher nome da eleição
        const nomeInput = await page.$('input[placeholder*="Eleições Gerais"]');
        if (nomeInput) {
            await nomeInput.click({ clickCount: 3 });
            await nomeInput.type(`Eleição Showcase ${new Date().toLocaleDateString('pt-BR')}`);
        }

        // Preencher descrição
        const descricaoInputs = await page.$$('input');
        for (const input of descricaoInputs) {
            const placeholder = await input.evaluate(el => el.placeholder);
            if (placeholder && placeholder.includes('Descrição')) {
                await input.click({ clickCount: 3 });
                await input.type('Eleição de demonstração criada automaticamente');
                break;
            }
        }

        // Configurar datas (hoje das 01:00 às 23:00)
        const hoje = new Date();
        const dataInicio = new Date(hoje);
        dataInicio.setHours(1, 0, 0, 0);
        const dataFim = new Date(hoje);
        dataFim.setHours(23, 0, 0, 0);

        // Preencher data de início usando aria-label
        const dataInicioFormatted = formatarDataHoraBR(dataInicio);
        const dataInicioInput = await page.$('input[aria-label="Data de Início"]');
        if (dataInicioInput) {
            await dataInicioInput.click({ clickCount: 3 });
            await dataInicioInput.type(dataInicioFormatted);
            await delay(500);
        } else {
            console.log('⚠️ Input de data de início não encontrado');
        }

        // Preencher data de fim usando aria-label
        const dataFimFormatted = formatarDataHoraBR(dataFim);
        const dataFimInput = await page.$('input[aria-label="Data de Término"]');
        if (dataFimInput) {
            await dataFimInput.click({ clickCount: 3 });
            await dataFimInput.type(dataFimFormatted);
            await delay(500);
        } else {
            console.log('⚠️ Input de data de término não encontrado');
        }

        // Selecionar categoria (presidente) - MultiSelectDropdown
        await delay(1000);

        // Procurar o botão do MultiSelectDropdown de forma mais robusta
        const categoriaButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            for (const btn of buttons) {
                // Verificar se tem um label próximo que menciona "Categorias"
                const parent = btn.closest('div');
                if (parent) {
                    const label = parent.querySelector('label');
                    if (label && label.textContent?.includes('Categorias')) {
                        return true; // Encontrou o botão
                    }
                }
            }
            return false;
        });

        if (categoriaButton) {
            // Clicar no botão usando evaluate
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                for (const btn of buttons) {
                    const parent = btn.closest('div');
                    if (parent) {
                        const label = parent.querySelector('label');
                        if (label && label.textContent?.includes('Categorias')) {
                            btn.click();
                            return;
                        }
                    }
                }
            });
            await delay(1000);

            // Procurar opção PRESIDENTE na lista
            await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('li button, ul button'));
                for (const item of items) {
                    if (item.textContent?.includes('PRESIDENTE')) {
                        item.click();
                        return;
                    }
                }
            });
            await delay(1000);

            // Clicar fora para fechar o dropdown
            await page.click('body');
            await delay(500);
        } else {
            console.log('⚠️ Botão de categorias não encontrado, tentando método alternativo...');
            // Tentar encontrar qualquer dropdown e selecionar PRESIDENTE
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button[type="button"]'));
                for (const btn of buttons) {
                    if (btn.textContent?.includes('Selecione') || btn.textContent?.includes('Categorias')) {
                        btn.click();
                        setTimeout(() => {
                            const items = Array.from(document.querySelectorAll('li button'));
                            for (const item of items) {
                                if (item.textContent?.includes('PRESIDENTE')) {
                                    item.click();
                                }
                            }
                        }, 500);
                        return;
                    }
                }
            });
            await delay(1500);
        }

        // Submeter formulário
        await delay(500);
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
            await submitButton.click();
            await delay(3000);
        }
        console.log('✅ Eleição criada\n');

        // ============================================
        // 3. CRIAR CANDIDATO
        // ============================================
        console.log('📝 Passo 3: Criando candidato...');
        // Aguardar modal de sucesso fechar se existir
        await delay(2000);

        // Clicar no botão "Candidatos" no menu de navegação
        const candidatosFound = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent?.trim() === 'Candidatos');
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (candidatosFound) {
            await delay(2000);
        } else {
            await page.goto(`${BASE_URL}/admin/candidatos`);
            await delay(2000);
        }

        // Clicar no botão "Novo Candidato"
        const novoCandidatoFound = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => {
                const text = b.textContent?.trim();
                return text.includes('Novo Candidato') || (text.includes('Novo') && text.includes('Candidato'));
            });
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (novoCandidatoFound) {
            await delay(2000);
        } else {
            await page.goto(`${BASE_URL}/admin/candidatos/criar`);
            await delay(2000);
        }

        // Selecionar eleição (a primeira disponível)
        const eleicaoSelect = await page.$('select');
        if (eleicaoSelect) {
            await eleicaoSelect.click();
            await delay(500);
            // Selecionar a primeira opção que não seja "Selecione uma eleição"
            await page.evaluate(() => {
                const select = document.querySelector('select');
                if (select && select.options.length > 1) {
                    select.selectedIndex = 1; // Primeira opção válida
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            await delay(1000);
        }

        // Selecionar cargo (primeiro disponível)
        const cargoSelects = await page.$$('select');
        if (cargoSelects.length > 1) {
            await cargoSelects[1].click();
            await delay(500);
            await page.evaluate((select) => {
                if (select.options.length > 1) {
                    select.selectedIndex = 1;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, cargoSelects[1]);
            await delay(500);
        }

        // Preencher número do candidato
        const numeroInput = await page.$('input[placeholder*="13, 45"]');
        if (numeroInput) {
            await numeroInput.click({ clickCount: 3 });
            await numeroInput.type('13');
        }

        // Preencher nome
        const nomeCandidatoInput = await page.$('input[placeholder*="nome completo"]');
        if (nomeCandidatoInput) {
            await nomeCandidatoInput.click({ clickCount: 3 });
            await nomeCandidatoInput.type('Candidato Showcase');
        }

        // Preencher partido
        const partidoInput = await page.$('input[placeholder*="PT, PSDB"]');
        if (partidoInput) {
            await partidoInput.click({ clickCount: 3 });
            await partidoInput.type('DEMO');
        }

        // Submeter
        await delay(500);
        const submitCandidato = await page.$('button[type="submit"]');
        if (submitCandidato) {
            await submitCandidato.click();
            await delay(3000);
        }
        console.log('✅ Candidato criado\n');

        // ============================================
        // 4. CRIAR ELEITOR
        // ============================================
        console.log('📝 Passo 4: Criando eleitor...');
        // Aguardar modal de sucesso fechar se existir
        await delay(2000);

        // Clicar no botão "Eleitores" no menu de navegação
        const eleitoresFound = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent?.trim() === 'Eleitores');
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (eleitoresFound) {
            await delay(2000);
        } else {
            await page.goto(`${BASE_URL}/admin/eleitores`);
            await delay(2000);
        }

        // Clicar no botão "Novo Eleitor"
        const novoEleitorFound = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => {
                const text = b.textContent?.trim();
                return text.includes('Novo Eleitor') || (text.includes('Novo') && text.includes('Eleitor'));
            });
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (novoEleitorFound) {
            await delay(2000);
        } else {
            await page.goto(`${BASE_URL}/admin/eleitores/criar`);
            await delay(2000);
        }

        // Preencher CPF
        const cpfEleitorInput = await page.$('input[placeholder*="CPF"]');
        if (cpfEleitorInput) {
            await cpfEleitorInput.click({ clickCount: 3 });
            await cpfEleitorInput.type(ELEITOR_CPF);
        }

        // Preencher senha
        const senhaEleitorInput = await page.$('input[type="password"]');
        if (senhaEleitorInput) {
            await senhaEleitorInput.click({ clickCount: 3 });
            await senhaEleitorInput.type(ELEITOR_SENHA);
        }

        // Preencher zona
        const zonaInput = await page.$('input[placeholder*="123"]');
        if (zonaInput) {
            await zonaInput.click({ clickCount: 3 });
            await zonaInput.type('123');
        }

        // Preencher seção
        const secaoInputs = await page.$$('input[type="number"]');
        if (secaoInputs.length > 1) {
            await secaoInputs[1].click({ clickCount: 3 });
            await secaoInputs[1].type('123');
        }

        // Submeter
        await delay(500);
        const submitEleitor = await page.$('button[type="submit"]');
        if (submitEleitor) {
            await submitEleitor.click();
            await delay(3000);
        }
        console.log('✅ Eleitor criado\n');

        // ============================================
        // 5. DESLOGAR
        // ============================================
        console.log('📝 Passo 5: Deslogando...');
        // Procurar botão de logout no header
        const logoutFound = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent?.trim() === 'Sair');
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (logoutFound) {
            await delay(2000);
        } else {
            // Limpar localStorage e redirecionar
            await page.evaluate(() => {
                localStorage.clear();
                window.location.href = '/login';
            });
            await delay(2000);
        }
        console.log('✅ Deslogado\n');

        // ============================================
        // 6. LOGIN COMO ELEITOR
        // ============================================
        console.log('📝 Passo 6: Fazendo login como eleitor...');
        await page.goto(`${BASE_URL}/login`);
        await delay(1000);

        const cpfEleitorLogin = await page.$('input[type="text"]');
        await cpfEleitorLogin.click({ clickCount: 3 });
        await cpfEleitorLogin.type(ELEITOR_CPF);

        const senhaEleitorLogin = await page.$('input[type="password"]');
        await senhaEleitorLogin.click({ clickCount: 3 });
        await senhaEleitorLogin.type(ELEITOR_SENHA);

        await page.click('button[type="submit"]');
        await waitForNavigation(page);
        await delay(2000);
        console.log('✅ Login como eleitor realizado\n');

        // ============================================
        // 7. ESCOLHER ELEIÇÃO E VOTAR
        // ============================================
        console.log('📝 Passo 7: Escolhendo eleição e votando...');
        await delay(2000);

        // Limpar qualquer token anterior no localStorage antes de começar
        await page.evaluate(() => {
            // Limpar tokens antigos de eleições anteriores
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('tokenVotacao_') || key.startsWith('tokenValidoAte_')) {
                    localStorage.removeItem(key);
                }
            });
        });

        // Clicar na primeira eleição disponível (garantir apenas um clique)
        await delay(1000);

        // Procurar botão "Votar Agora" e clicar apenas uma vez
        await page.waitForFunction(() => {
            const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Votar Agora'));
            return !!btn;
        });

        await page.evaluate(() => {
            const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Votar Agora'));
            if (btn && !btn.dataset.clicked) {
                btn.dataset.clicked = 'true';
                btn.click();
            }
        });
        // Aguardar carregamento da página de votação
        await delay(4000);

        // Procurar botão "Iniciar Votação" ou "Continuar" no modal de token
        // Tentar múltiplas vezes pois o modal pode demorar para aparecer
        let continuarFound = false;
        for (let i = 0; i < 8; i++) {
            const btnFound = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const btn = buttons.find(b => {
                    const text = b.textContent?.trim();
                    return (text === 'Iniciar Votação' || text === 'Continuar') && !b.disabled;
                });
                if (btn) {
                    // Verificar se já foi clicado recentemente
                    const now = Date.now();
                    const lastClick = window.lastTokenClick || 0;
                    if (now - lastClick < 2000) {
                        return false;
                    }
                    window.lastTokenClick = now;
                    btn.click();
                    return true;
                }
                return false;
            });

            if (btnFound) {
                continuarFound = true;
                console.log('✅ Botão "Iniciar Votação" clicado');
                await delay(2000);
                break;
            }
            await delay(1000);
        }

        if (!continuarFound) {
            console.log('⚠️ Modal de token não encontrado após tentativas, continuando...');
        }

        // Aguardar a urna aparecer completamente
        await delay(2000);

        // Verificar se a urna está visível
        const urnaVisible = await page.evaluate(() => {
            const urna = document.querySelector('[class*="Ballot"], [class*="ballot"]');
            return urna !== null;
        });

        if (!urnaVisible) {
            console.log('⚠️ Urna não encontrada, aguardando mais tempo...');
            await delay(3000);
        }

        // Digitar número do candidato (13)
        // Procurar botões numéricos da urna (teclado numérico)
        // Primeiro dígito: 1
        const digit1Clicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            // Procurar botão numérico "1" (não pode ser o botão de corrigir ou outros)
            const btn1 = buttons.find(btn => {
                const text = btn.textContent?.trim();
                return text === '1' && !btn.disabled;
            });
            if (btn1) {
                btn1.click();
                return true;
            }
            return false;
        });

        if (digit1Clicked) {
            await delay(800);
        } else {
            console.log('⚠️ Botão "1" não encontrado');
        }

        // Segundo dígito: 3
        const digit3Clicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn3 = buttons.find(btn => {
                const text = btn.textContent?.trim();
                return text === '3' && !btn.disabled;
            });
            if (btn3) {
                btn3.click();
                return true;
            }
            return false;
        });

        if (digit3Clicked) {
            await delay(1500); // Aguardar candidato aparecer
        } else {
            console.log('⚠️ Botão "3" não encontrado');
        }

        // Verificar se o candidato foi encontrado
        const candidatoEncontrado = await page.evaluate(() => {
            const elementos = Array.from(document.querySelectorAll('*'));
            for (const el of elementos) {
                const text = el.textContent || '';
                if (text.includes('Candidato Showcase') || text.includes('DEMO')) {
                    return true;
                }
            }
            return false;
        });

        if (!candidatoEncontrado) {
            console.log('⚠️ Candidato não encontrado após digitar número, tentando continuar...');
        }

        // Confirmar voto (botão CONFIRMA na urna)
        await delay(2000);

        // Procurar botão de confirmar na urna (pode estar desabilitado se não houver candidato)
        const confirmarUrnaFound = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => {
                const text = b.textContent?.trim().toUpperCase();
                return (text === 'CONFIRMAR' || text === 'CONFIRMA') && !b.disabled;
            });
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (confirmarUrnaFound) {
            console.log('✅ Botão CONFIRMAR na urna clicado');
            await delay(2000);
        } else {
            console.log('⚠️ Botão CONFIRMAR na urna não encontrado ou desabilitado');
        }

        // Aguardar modal de confirmação aparecer
        await delay(2000);

        // Confirmar no modal de confirmação (VoteConfirmModal)
        let confirmarModalFound = false;
        for (let i = 0; i < 5; i++) {
            const found = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const btn = buttons.find(b => {
                    const text = b.textContent?.trim();
                    return (text === 'Confirmar' || text === 'Confirmar e Finalizar') && !b.disabled;
                });
                if (btn) {
                    btn.click();
                    return true;
                }
                return false;
            });

            if (found) {
                confirmarModalFound = true;
                console.log('✅ Modal de confirmação confirmado');
                await delay(3000);
                break;
            }
            await delay(1000);
        }

        if (!confirmarModalFound) {
            console.log('⚠️ Modal de confirmação não encontrado');
        }

        console.log('✅ Voto realizado com sucesso!\n');

        console.log('🎉 Showcase completo! Todas as etapas foram executadas.');

        // Manter o navegador aberto por 5 segundos para visualização
        await delay(5000);

    } catch (error) {
        console.error('❌ Erro durante a automação:', error);
        // Tirar screenshot em caso de erro
        await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

// Executar o script
runShowcase().catch(console.error);

