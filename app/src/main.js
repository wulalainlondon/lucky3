        const _isNativePlatform = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
        if ('serviceWorker' in navigator && !_isNativePlatform) {
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                window.location.reload();
            });

            navigator.serviceWorker.register('./sw.js').then((registration) => {
                registration.update().catch(() => { });

                setInterval(() => {
                    registration.update().catch(() => { });
                }, 60 * 1000);

                document.addEventListener('visibilitychange', () => {
                    if (!document.hidden) {
                        registration.update().catch(() => { });
                    }
                });

                window.addEventListener('focus', () => {
                    registration.update().catch(() => { });
                });
            }).catch((err) => {
                console.error('SW registration failed:', err);
            });
        }

        const suits = ['♠', '♥', '♦', '♣'], ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const APP_VERSION = '2026.05.03-v1';
        const GAME_STATE_KEY = 'lucky3-current-game';
        const SETTINGS_KEY = 'lucky3-settings';
        const TUTORIAL_STATE_KEY = 'lucky3-tutorial-state-v1';
        const DAILY_NORMAL_CYCLE_KEY = 'lucky3-daily-normal-cycle-v1';
        const ACHIEVEMENTS_KEY = 'lucky3-achievements-v1';
        const WIN_HISTORY_KEY = 'lucky3-win-history-v1';

        function loadWinHistory() {
            try { return JSON.parse(localStorage.getItem(WIN_HISTORY_KEY) || '{}'); }
            catch { return {}; }
        }

        function saveWinHistory(h) {
            localStorage.setItem(WIN_HISTORY_KEY, JSON.stringify(h));
        }
        const DAILY_CHALLENGE_KEY = 'lucky3-daily-challenge-v1';
        const DEV_MODE_KEY = 'lucky3-dev-mode-v1';
        const SEED_CHEAT_MODE_KEY = 'lucky3-seed-cheat-mode-v1';
        const TUTORIAL_FIXED_SEED = 6;
        const FORTUNE_POOL = {
            'zh-Hant': {
                '♠': [
                    '今日幸運籤：黑桃 3。做決定會特別果斷，工作與學習容易一次到位。',
                    '今日幸運籤：黑桃 3。你今天的行動力很強，卡關的事有機會快速突破。',
                    '今日幸運籤：黑桃 3。今天很適合處理最難的那件事，完成率偏高。',
                    '今日幸運籤：黑桃 3。專注力上升，短時間內就能把重點做完。',
                    '今日幸運籤：黑桃 3。你今天的判斷很準，適合拍板定案。',
                    '今日幸運籤：黑桃 3。勇敢往前一步，會遇到關鍵轉機。',
                    '今日幸運籤：黑桃 3。效率運亮起來，今天做事會特別俐落。',
                    '今日幸運籤：黑桃 3。今天適合清單式推進，越做越順。',
                    '今日幸運籤：黑桃 3。思路清晰，複雜問題會被你拆得很漂亮。',
                    '今日幸運籤：黑桃 3。今天是突破日，先做最難的反而最省力。',
                    '今日幸運籤：黑桃 3。你會比預期更快看到成果，放心衝刺。',
                    '今日幸運籤：黑桃 3。適合開啟新計畫，第一步就有好手感。',
                    '今日幸運籤：黑桃 3。臨場反應特別好，今天很有主導權。',
                    '今日幸運籤：黑桃 3。今天做取捨特別準，時間會被你用得很好。',
                    '今日幸運籤：黑桃 3。你今天的節奏很穩，容易連續拿下小勝利。',
                    '今日幸運籤：黑桃 3。直覺與理性同時在線，做什麼都更有把握。'
                ],
                '♥': [
                    '今日幸運籤：紅心 3。人際運上升，適合主動聯絡重要的人，會有好回應。',
                    '今日幸運籤：紅心 3。今天特別有溫暖緣分，合作與溝通都更順。',
                    '今日幸運籤：紅心 3。今天說出的善意會被放大，回饋會很快出現。',
                    '今日幸運籤：紅心 3。關係運走強，適合修復小誤會、拉近距離。',
                    '今日幸運籤：紅心 3。你今天很有感染力，容易得到支持。',
                    '今日幸運籤：紅心 3。今天適合表達感謝，會收穫超乎預期的善意。',
                    '今日幸運籤：紅心 3。情緒韌性高，今天能把心情照顧得很好。',
                    '今日幸運籤：紅心 3。溝通運佳，難聊的話題也能柔順落地。',
                    '今日幸運籤：紅心 3。今天容易遇到願意幫你一把的人。',
                    '今日幸運籤：紅心 3。真誠會成為你的幸運鑰匙。',
                    '今日幸運籤：紅心 3。今天適合合作，彼此加成感特別明顯。',
                    '今日幸運籤：紅心 3。把心裡想說的說出口，會有溫暖回音。',
                    '今日幸運籤：紅心 3。今天的你很有親和力，關係自然升溫。',
                    '今日幸運籤：紅心 3。柔軟但不退讓，今天會是很漂亮的平衡。',
                    '今日幸運籤：紅心 3。你今天散發安定感，容易成為團隊核心。',
                    '今日幸運籤：紅心 3。開放心態會帶來一個讓你心情很好的消息。'
                ],
                '♦': [
                    '今日幸運籤：方塊 3。財運與機會運偏強，小機會可能帶來大收穫。',
                    '今日幸運籤：方塊 3。今天適合談資源與效率，容易拿到超值結果。',
                    '今日幸運籤：方塊 3。今天對價格與價值的判斷特別準。',
                    '今日幸運籤：方塊 3。小小嘗試會帶來實際回報，值得主動出擊。',
                    '今日幸運籤：方塊 3。今天適合整理財務與計畫，會越理越清楚。',
                    '今日幸運籤：方塊 3。你今天很容易抓到高 CP 的選擇。',
                    '今日幸運籤：方塊 3。實用運很強，手邊工具與資源都能派上用場。',
                    '今日幸運籤：方塊 3。今天是小投入大回報的一天。',
                    '今日幸運籤：方塊 3。你今天會遇到提升效率的關鍵線索。',
                    '今日幸運籤：方塊 3。適合把想法落地，成果會比預期快。',
                    '今日幸運籤：方塊 3。今天的選擇題，你更容易選到對的那個。',
                    '今日幸運籤：方塊 3。把握小窗口，可能換來長期好處。',
                    '今日幸運籤：方塊 3。今天適合談條件，你會拿到漂亮平衡點。',
                    '今日幸運籤：方塊 3。偏財是資訊運，今天多看一眼就有收穫。',
                    '今日幸運籤：方塊 3。你今天的務實力很強，成效看得見。',
                    '今日幸運籤：方塊 3。好機會正在靠近，記得主動伸手接住。'
                ],
                '♣': [
                    '今日幸運籤：梅花 3。穩定運很強，手上的計畫可望扎實推進。',
                    '今日幸運籤：梅花 3。今天適合打基礎，持續做就會看到明顯成果。',
                    '今日幸運籤：梅花 3。累積型任務今天特別有感，越做越順。',
                    '今日幸運籤：梅花 3。你的耐心今天就是幸運，慢慢來反而最快。',
                    '今日幸運籤：梅花 3。今天適合把流程優化，後續會省很多力。',
                    '今日幸運籤：梅花 3。穩穩前進就是王道，成果正在堆高。',
                    '今日幸運籤：梅花 3。今天是小步快跑的好日子。',
                    '今日幸運籤：梅花 3。你今天很適合收斂與整理，品質會上升。',
                    '今日幸運籤：梅花 3。把節奏守住，今天會收穫一種踏實的好運。',
                    '今日幸運籤：梅花 3。穩定推進帶來驚喜，晚一點會看到回報。',
                    '今日幸運籤：梅花 3。今天很適合完成差最後一步的任務。',
                    '今日幸運籤：梅花 3。你今天的持續力很強，適合做長線布局。',
                    '今日幸運籤：梅花 3。今天把基礎打好，明天就能加速起飛。',
                    '今日幸運籤：梅花 3。你的節奏感在線，事情會一件件到位。',
                    '今日幸運籤：梅花 3。保持簡單與一致，今天會非常有收穫。',
                    '今日幸運籤：梅花 3。今天是成長日，穩定就是最強幸運。'
                ]
            },
            'en': {
                '♠': [
                    "Lucky Spade 3: your focus is crystal clear today, tackle the hardest task first and win.",
                    "Lucky Spade 3: decision-making flows effortlessly today, trust your instincts and commit.",
                    "Lucky Spade 3: your productivity is peaking, one focused sprint will take you far.",
                    "Lucky Spade 3: clarity arrives just when you need it, complex problems untangle easily.",
                    "Lucky Spade 3: momentum is on your side today, start strong and keep pushing forward.",
                    "Lucky Spade 3: sharp thinking turns obstacles into stepping stones for you today."
                ],
                '♥': [
                    "Lucky Heart 3: warm connections are everywhere today, reach out and someone will respond.",
                    "Lucky Heart 3: your words carry extra warmth today, share something kind and watch it bloom.",
                    "Lucky Heart 3: a conversation you have today could strengthen an important relationship.",
                    "Lucky Heart 3: emotional intelligence is your superpower today, people feel safe around you.",
                    "Lucky Heart 3: team energy is high and collaborative, let synergy do the heavy lifting.",
                    "Lucky Heart 3: expressing gratitude today opens a door you did not expect to find."
                ],
                '♦': [
                    "Lucky Diamond 3: a small practical move today could bring surprisingly solid returns.",
                    "Lucky Diamond 3: your eye for value is sharp today, the right choice reveals itself clearly.",
                    "Lucky Diamond 3: resources align in your favor, a modest effort yields meaningful results.",
                    "Lucky Diamond 3: financial clarity arrives today, a quick review unlocks a smart next step.",
                    "Lucky Diamond 3: a hidden opportunity is nearby, a second look turns it into real gain.",
                    "Lucky Diamond 3: practical wisdom guides you now, efficiency compounds into good fortune."
                ],
                '♣': [
                    "Lucky Club 3: steady progress is your winning formula today, keep your rhythm and trust it.",
                    "Lucky Club 3: every small step you take today is quietly stacking into something great.",
                    "Lucky Club 3: patience is your lucky charm, consistency outperforms urgency today.",
                    "Lucky Club 3: the task that feels almost done will cross the finish line beautifully today.",
                    "Lucky Club 3: building solid foundations now sets you up for an effortless leap tomorrow.",
                    "Lucky Club 3: your endurance shines today, sustained effort brings a satisfying reward."
                ]
            },
            'ja': {
                '♠': [
                    "ラッキースペード3：今日は集中力が最高潮、難しいことから手をつけると一気に突破できる。",
                    "ラッキースペード3：決断力が冴えわたる一日、迷わず進めば想像以上の結果が待っている。",
                    "ラッキースペード3：思考がクリアで効率が上がる、タスクリストを一気に片付けるチャンス。",
                    "ラッキースペード3：直感と論理が一致する日、自信を持って選択すれば必ず道が開ける。",
                    "ラッキースペード3：行動力が高まっている今日、最初の一歩が大きな勢いを生み出す。",
                    "ラッキースペード3：複雑な問題もシンプルに解けるとき、冷静に取り組めば答えは近い。"
                ],
                '♥': [
                    "ラッキーハート3：人間関係の運が上昇中、大切な人に声をかければ温かい返事が返ってくる。",
                    "ラッキーハート3：あなたの言葉に温もりが宿る今日、感謝を伝えると予想外の喜びが生まれる。",
                    "ラッキーハート3：コミュニケーションがスムーズな一日、難しい話題も穏やかにまとまる。",
                    "ラッキーハート3：共感力が高まっているとき、周りの人があなたの存在に安心感を覚える。",
                    "ラッキーハート3：協力関係が深まる日、一緒に取り組むことで相乗効果が生まれる。",
                    "ラッキーハート3：心を開いて接すると、思いがけないところから応援が届く。"
                ],
                '♦': [
                    "ラッキーダイヤ3：金運と機会運が高まる今日、小さな行動が大きなリターンに変わる。",
                    "ラッキーダイヤ3：価値を見抜く目が冴える日、賢い選択が実際の成果につながる。",
                    "ラッキーダイヤ3：少ない投資で大きな効果が得られるとき、タイミングを逃さず動こう。",
                    "ラッキーダイヤ3：財務の見直しに最適な日、整理するほど次の一手が明確になる。",
                    "ラッキーダイヤ3：見落としていたチャンスが近くにある、もう一度よく見ると収穫がある。",
                    "ラッキーダイヤ3：実用的な判断が光る今日、地に足ついた行動が確かな果実を生む。"
                ],
                '♣': [
                    "ラッキークラブ3：着実に進む力が強まる今日、コツコツ続けることが最大の幸運になる。",
                    "ラッキークラブ3：積み重ねの効果が出やすい日、小さな一歩が確実に未来を作っている。",
                    "ラッキークラブ3：忍耐がラッキーチャームになるとき、焦らず進めばゴールは必ず近づく。",
                    "ラッキークラブ3：あと一歩で完成する仕事が今日スッキリ終わる予感がする。",
                    "ラッキークラブ3：基盤をしっかり固める今日の努力が明日の飛躍を支えてくれる。",
                    "ラッキークラブ3：リズムを守り続ける今日、継続の力がじわじわと報われてくる。"
                ]
            },
            'ko': {
                '♠': [
                    "행운의 스페이드 3: 오늘은 집중력이 최고조, 가장 어려운 일부터 시작하면 단번에 해결된다.",
                    "행운의 스페이드 3: 결단력이 빛나는 하루, 망설임 없이 나아가면 기대 이상의 성과가 기다린다.",
                    "행운의 스페이드 3: 생각이 맑고 효율이 오르는 날, 할 일 목록을 시원하게 정리할 기회다.",
                    "행운의 스페이드 3: 직관과 논리가 일치하는 오늘, 자신감 있게 선택하면 길이 열린다.",
                    "행운의 스페이드 3: 행동력이 넘치는 지금, 첫걸음을 내딛으면 큰 탄력이 생긴다.",
                    "행운의 스페이드 3: 복잡한 문제도 단순하게 풀리는 날, 침착하게 접근하면 답이 보인다."
                ],
                '♥': [
                    "행운의 하트 3: 인간관계 운이 상승 중, 소중한 사람에게 먼저 연락하면 따뜻한 답이 온다.",
                    "행운의 하트 3: 오늘 당신의 말에 온기가 담겨 있어, 감사를 전하면 뜻밖의 기쁨이 찾아온다.",
                    "행운의 하트 3: 소통이 부드러운 하루, 어려운 이야기도 차분하게 잘 마무리된다.",
                    "행운의 하트 3: 공감 능력이 높아지는 때, 주변 사람들이 당신 곁에서 편안함을 느낀다.",
                    "행운의 하트 3: 협력 관계가 깊어지는 날, 함께하면 시너지 효과가 배로 커진다.",
                    "행운의 하트 3: 마음을 열고 다가가면 예상치 못한 곳에서 응원이 들려온다."
                ],
                '♦': [
                    "행운의 다이아몬드 3: 재운과 기회운이 높아지는 오늘, 작은 행동이 큰 수익으로 이어진다.",
                    "행운의 다이아몬드 3: 가치를 꿰뚫는 눈이 빛나는 날, 현명한 선택이 실질적인 성과를 만든다.",
                    "행운의 다이아몬드 3: 적은 투자로 큰 효과를 볼 수 있을 때, 타이밍을 놓치지 말고 움직이자.",
                    "행운의 다이아몬드 3: 재정 점검에 최적인 날, 정리할수록 다음 행동이 명확해진다.",
                    "행운의 다이아몬드 3: 놓쳤던 기회가 가까이 있어, 다시 한번 살펴보면 수확이 있다.",
                    "행운의 다이아몬드 3: 실용적인 판단이 빛나는 오늘, 발 딛고 선 행동이 확실한 결실을 맺는다."
                ],
                '♣': [
                    "행운의 클럽 3: 꾸준히 나아가는 힘이 강해지는 오늘, 성실함이 최고의 행운이 된다.",
                    "행운의 클럽 3: 쌓이는 효과가 나타나기 좋은 날, 작은 한 걸음이 확실히 미래를 만들어간다.",
                    "행운의 클럽 3: 인내가 행운의 열쇠가 되는 때, 서두르지 않으면 목표는 반드시 가까워진다.",
                    "행운의 클럽 3: 거의 완성된 일이 오늘 깔끔하게 마무리될 것 같은 예감이 든다.",
                    "행운의 클럽 3: 오늘 탄탄히 다진 기반이 내일의 도약을 받쳐줄 것이다.",
                    "행운의 클럽 3: 리듬을 계속 지키는 오늘, 꾸준함의 힘이 서서히 보상받기 시작한다."
                ]
            },
            'es': {
                '♠': [
                    "Pica Afortunada 3: hoy tu concentracion es excepcional, empieza por lo mas dificil y lo lograras.",
                    "Pica Afortunada 3: tu capacidad de decision brilla hoy, confía en tu instinto y avanza sin dudar.",
                    "Pica Afortunada 3: la claridad mental es tu aliada, aprovecha este estado de flujo productivo.",
                    "Pica Afortunada 3: los problemas complejos se simplifican hoy, abórdalos con calma y verás la solución.",
                    "Pica Afortunada 3: tu energía está en su punto más alto, un arranque fuerte hoy marca la diferencia.",
                    "Pica Afortunada 3: intuición y lógica van de la mano hoy, tus elecciones acertarán en el blanco."
                ],
                '♥': [
                    "Corazon Afortunado 3: las conexiones humanas florecen hoy, da el primer paso y recibirás calidez.",
                    "Corazon Afortunado 3: tus palabras tienen un poder especial hoy, expresa gratitud y observa el efecto.",
                    "Corazon Afortunado 3: la comunicación fluye sin esfuerzo, hasta los temas difíciles se resuelven bien.",
                    "Corazon Afortunado 3: tu empatía es tu superpoder hoy, la gente se siente segura a tu lado.",
                    "Corazon Afortunado 3: la colaboración multiplica los resultados hoy, trabajar en equipo es tu ventaja.",
                    "Corazon Afortunado 3: abrir tu corazón hoy atrae apoyo desde donde menos lo esperas."
                ],
                '♦': [
                    "Diamante Afortunado 3: una pequeña accion práctica hoy puede convertirse en un gran retorno.",
                    "Diamante Afortunado 3: tu ojo para el valor está afinado, la mejor opción se revela con claridad.",
                    "Diamante Afortunado 3: los recursos se alinean a tu favor, un esfuerzo modesto rinde grandes frutos.",
                    "Diamante Afortunado 3: revisar tus finanzas hoy desbloquea un paso inteligente que no habías visto.",
                    "Diamante Afortunado 3: una oportunidad oculta está cerca, una segunda mirada la convierte en ganancia.",
                    "Diamante Afortunado 3: la sabiduria práctica te guía ahora, la eficiencia se convierte en buena fortuna."
                ],
                '♣': [
                    "Trebol Afortunado 3: el progreso constante es tu fórmula ganadora hoy, mantén el ritmo y confía.",
                    "Trebol Afortunado 3: cada pequeño paso de hoy se acumula silenciosamente en algo extraordinario.",
                    "Trebol Afortunado 3: la paciencia es tu amuleto de suerte, la constancia supera a la urgencia hoy.",
                    "Trebol Afortunado 3: esa tarea casi terminada cruzará la línea de meta de forma brillante hoy.",
                    "Trebol Afortunado 3: construir bases sólidas hoy te prepara para un salto sin esfuerzo mañana.",
                    "Trebol Afortunado 3: tu resistencia brilla hoy, el esfuerzo sostenido trae una recompensa satisfactoria."
                ]
            },
            'pt-BR': {
                '♠': [
                    "Espada da Sorte 3: seu foco está no ponto máximo hoje, comece pelo mais difícil e você vai vencer.",
                    "Espada da Sorte 3: sua capacidade de decisão brilha hoje, confie no instinto e avance sem hesitar.",
                    "Espada da Sorte 3: a clareza mental é sua aliada, aproveite esse estado de fluxo produtivo.",
                    "Espada da Sorte 3: problemas complexos se simplificam hoje, aborde-os com calma e verá a solução.",
                    "Espada da Sorte 3: sua energia está no auge, um começo forte hoje faz toda a diferença.",
                    "Espada da Sorte 3: intuição e lógica caminham juntas hoje, suas escolhas vão acertar em cheio."
                ],
                '♥': [
                    "Copas da Sorte 3: conexões humanas florescem hoje, dê o primeiro passo e receberá carinho.",
                    "Copas da Sorte 3: suas palavras têm um poder especial hoje, expresse gratidão e observe o efeito.",
                    "Copas da Sorte 3: a comunicação flui sem esforço, até os assuntos difíceis se resolvem bem.",
                    "Copas da Sorte 3: sua empatia é seu superpoder hoje, as pessoas se sentem seguras perto de você.",
                    "Copas da Sorte 3: a colaboração multiplica os resultados hoje, trabalhar em equipe é sua vantagem.",
                    "Copas da Sorte 3: abrir seu coração hoje atrai apoio de onde você menos espera."
                ],
                '♦': [
                    "Ouros da Sorte 3: uma pequena ação prática hoje pode se transformar em um grande retorno.",
                    "Ouros da Sorte 3: seu olho para o valor está afinado, a melhor opção se revela com clareza.",
                    "Ouros da Sorte 3: os recursos se alinham a seu favor, um esforço modesto rende grandes frutos.",
                    "Ouros da Sorte 3: revisar suas finanças hoje desbloqueia um passo inteligente que você não tinha visto.",
                    "Ouros da Sorte 3: uma oportunidade oculta está próxima, um segundo olhar a transforma em ganho.",
                    "Ouros da Sorte 3: a sabedoria prática guia você agora, a eficiência se converte em boa fortuna."
                ],
                '♣': [
                    "Paus da Sorte 3: o progresso constante é sua fórmula vencedora hoje, mantenha o ritmo e confie.",
                    "Paus da Sorte 3: cada pequeno passo de hoje se acumula silenciosamente em algo extraordinário.",
                    "Paus da Sorte 3: a paciência é seu amuleto da sorte, a constância supera a urgência hoje.",
                    "Paus da Sorte 3: aquela tarefa quase concluída vai cruzar a linha de chegada lindamente hoje.",
                    "Paus da Sorte 3: construir bases sólidas hoje te prepara para um salto sem esforço amanhã.",
                    "Paus da Sorte 3: sua resistência brilha hoje, o esforço sustentado traz uma recompensa satisfatória."
                ]
            },
            'th': {
                '♠': [
                    "โชคดีโพดำ 3: วันนี้สมาธิของคุณแจ่มใสสุดๆ เริ่มจากงานที่ยากที่สุดแล้วคุณจะทะลุผ่านได้",
                    "โชคดีโพดำ 3: ความสามารถในการตัดสินใจของคุณโดดเด่นวันนี้ ไว้ใจสัญชาตญาณแล้วก้าวไปข้างหน้า",
                    "โชคดีโพดำ 3: ความคิดชัดเจนและประสิทธิภาพสูง ใช้โอกาสนี้จัดการรายการสิ่งที่ต้องทำให้สำเร็จ",
                    "โชคดีโพดำ 3: สัญชาตญาณและตรรกะสอดคล้องกันวันนี้ ตัดสินใจด้วยความมั่นใจแล้วทางจะเปิดออก",
                    "โชคดีโพดำ 3: พลังงานของคุณอยู่ในจุดสูงสุด เริ่มต้นอย่างแข็งแกร่งวันนี้จะสร้างแรงโมเมนตัมอันยิ่งใหญ่",
                    "โชคดีโพดำ 3: ปัญหาซับซ้อนก็คลี่คลายได้ง่ายวันนี้ จัดการอย่างใจเย็นแล้วคำตอบจะปรากฏ"
                ],
                '♥': [
                    "โชคดีหัวใจ 3: ความสัมพันธ์รุ่งเรืองวันนี้ ติดต่อคนสำคัญก่อนแล้วจะได้รับความอบอุ่นกลับมา",
                    "โชคดีหัวใจ 3: คำพูดของคุณมีพลังพิเศษวันนี้ แสดงความขอบคุณแล้วดูผลที่น่าประหลาดใจ",
                    "โชคดีหัวใจ 3: การสื่อสารไหลลื่นไม่มีแรงเสียดทาน แม้แต่หัวข้อยากก็จบลงได้ดี",
                    "โชคดีหัวใจ 3: ความเห็นอกเห็นใจคือพลังพิเศษของคุณวันนี้ คนรอบข้างรู้สึกปลอดภัยเมื่ออยู่ใกล้คุณ",
                    "โชคดีหัวใจ 3: การร่วมมือกันทวีคูณผลลัพธ์วันนี้ การทำงานเป็นทีมคือข้อได้เปรียบของคุณ",
                    "โชคดีหัวใจ 3: การเปิดใจวันนี้ดึงดูดการสนับสนุนจากที่ที่คุณไม่คาดคิด"
                ],
                '♦': [
                    "โชคดีไพ่ข้าวหลามตัด 3: การกระทำเล็กๆ วันนี้อาจกลายเป็นผลตอบแทนที่น่าประหลาดใจ",
                    "โชคดีไพ่ข้าวหลามตัด 3: สายตาของคุณมองเห็นคุณค่าได้คมชัดวันนี้ ตัวเลือกที่ดีที่สุดเผยตัวออกมาชัดเจน",
                    "โชคดีไพ่ข้าวหลามตัด 3: ทรัพยากรเรียงตัวเข้าข้างคุณ ความพยายามเล็กน้อยให้ผลลัพธ์ที่มีความหมาย",
                    "โชคดีไพ่ข้าวหลามตัด 3: ทบทวนการเงินวันนี้ปลดล็อกก้าวต่อไปที่ชาญฉลาดที่คุณยังไม่เคยเห็น",
                    "โชคดีไพ่ข้าวหลามตัด 3: โอกาสที่ซ่อนอยู่อยู่ใกล้แค่นี้ มองอีกครั้งแล้วมันจะกลายเป็นกำไรจริงๆ",
                    "โชคดีไพ่ข้าวหลามตัด 3: ปัญญาปฏิบัติชี้นำคุณตอนนี้ ประสิทธิภาพสะสมกลายเป็นโชคดี"
                ],
                '♣': [
                    "โชคดีดอกจิก 3: ความก้าวหน้าสม่ำเสมอคือสูตรชนะของคุณวันนี้ รักษาจังหวะและไว้ใจกระบวนการ",
                    "โชคดีดอกจิก 3: ทุกก้าวเล็กๆ ของวันนี้สะสมอย่างเงียบๆ กลายเป็นสิ่งยิ่งใหญ่",
                    "โชคดีดอกจิก 3: ความอดทนคือเครื่องรางนำโชคของคุณ ความสม่ำเสมอดีกว่าความเร่งด่วนวันนี้",
                    "โชคดีดอกจิก 3: งานที่เกือบเสร็จนั้นจะข้ามเส้นชัยได้อย่างสวยงามวันนี้",
                    "โชคดีดอกจิก 3: การสร้างฐานรากที่แน่นวันนี้เตรียมคุณให้พร้อมสำหรับการก้าวกระโดดที่ง่ายดายพรุ่งนี้",
                    "โชคดีดอกจิก 3: ความทนทานของคุณโดดเด่นวันนี้ ความพยายามที่ต่อเนื่องนำมาซึ่งรางวัลที่น่าพึงพอใจ"
                ]
            },
            'id': {
                '♠': [
                    "Sekop Keberuntungan 3: fokusmu sangat tajam hari ini, mulailah dari yang paling sulit dan kamu akan berhasil.",
                    "Sekop Keberuntungan 3: kemampuan pengambilan keputusanmu bersinar hari ini, percayai nalurimu dan melangkahlah.",
                    "Sekop Keberuntungan 3: kejernihan mental adalah temanmu, manfaatkan kondisi produktif ini sebaik-baiknya.",
                    "Sekop Keberuntungan 3: masalah rumit menjadi lebih sederhana hari ini, hadapi dengan tenang dan solusinya terlihat.",
                    "Sekop Keberuntungan 3: energimu sedang di puncak, awal yang kuat hari ini menciptakan momentum besar.",
                    "Sekop Keberuntungan 3: intuisi dan logika berjalan seiring hari ini, pilihanmu akan tepat sasaran."
                ],
                '♥': [
                    "Hati Keberuntungan 3: koneksi manusia berkembang hari ini, ambil inisiatif dan kamu akan menerima kehangatan.",
                    "Hati Keberuntungan 3: kata-katamu memiliki kekuatan istimewa hari ini, ungkapkan rasa syukur dan lihat hasilnya.",
                    "Hati Keberuntungan 3: komunikasi mengalir lancar, bahkan topik sulit pun diselesaikan dengan baik.",
                    "Hati Keberuntungan 3: empatimu adalah kekuatan supermu hari ini, orang-orang merasa aman di dekatmu.",
                    "Hati Keberuntungan 3: kolaborasi melipatgandakan hasil hari ini, bekerja sama adalah keunggulanmu.",
                    "Hati Keberuntungan 3: membuka hatimu hari ini menarik dukungan dari tempat yang tidak kamu duga."
                ],
                '♦': [
                    "Berlian Keberuntungan 3: tindakan kecil yang praktis hari ini bisa menghasilkan keuntungan yang mengejutkan.",
                    "Berlian Keberuntungan 3: matamu untuk menilai kualitas sangat tajam, pilihan terbaik terungkap dengan jelas.",
                    "Berlian Keberuntungan 3: sumber daya berpihak padamu, usaha sederhana menghasilkan hasil yang bermakna.",
                    "Berlian Keberuntungan 3: meninjau keuanganmu hari ini membuka langkah cerdas yang belum pernah kamu lihat.",
                    "Berlian Keberuntungan 3: peluang tersembunyi ada di dekatmu, pandangan kedua mengubahnya menjadi keuntungan nyata.",
                    "Berlian Keberuntungan 3: kebijaksanaan praktis membimbingmu sekarang, efisiensi bertumpuk menjadi keberuntungan."
                ],
                '♣': [
                    "Klab Keberuntungan 3: kemajuan yang stabil adalah formula kemenanganmu hari ini, pertahankan ritme dan percayalah.",
                    "Klab Keberuntungan 3: setiap langkah kecil hari ini diam-diam menumpuk menjadi sesuatu yang luar biasa.",
                    "Klab Keberuntungan 3: kesabaran adalah jimat keberuntunganmu, konsistensi mengalahkan ketergesa-gesaan hari ini.",
                    "Klab Keberuntungan 3: tugas yang hampir selesai itu akan melewati garis finish dengan indah hari ini.",
                    "Klab Keberuntungan 3: membangun fondasi yang kokoh hari ini mempersiapkanmu untuk lompatan mudah besok.",
                    "Klab Keberuntungan 3: ketahananmu bersinar hari ini, usaha yang berkelanjutan membawa hadiah yang memuaskan."
                ]
            },
            'fr': {
                '♠': [
                    "Pique Chanceux 3: ta concentration est au sommet aujourd'hui, commence par le plus difficile et tu vas triompher.",
                    "Pique Chanceux 3: ton sens des decisions brille aujourd'hui, fais confiance a ton instinct et avance sans hesiter.",
                    "Pique Chanceux 3: la clarté mentale est ton alliée, profite de cet état de flux productif au maximum.",
                    "Pique Chanceux 3: les problèmes complexes se simplifient aujourd'hui, aborde-les calmement et la solution apparaît.",
                    "Pique Chanceux 3: ton énergie est à son maximum, un départ fort aujourd'hui crée un élan formidable.",
                    "Pique Chanceux 3: intuition et logique vont de pair aujourd'hui, tes choix vont toucher juste."
                ],
                '♥': [
                    "Coeur Chanceux 3: les connexions humaines s'épanouissent aujourd'hui, fais le premier pas et tu recevras de la chaleur.",
                    "Coeur Chanceux 3: tes mots ont un pouvoir spécial aujourd'hui, exprime ta gratitude et observe l'effet.",
                    "Coeur Chanceux 3: la communication coule sans effort, même les sujets difficiles se résolvent bien.",
                    "Coeur Chanceux 3: ton empathie est ton superpouvoir aujourd'hui, les gens se sentent en sécurité près de toi.",
                    "Coeur Chanceux 3: la collaboration multiplie les résultats aujourd'hui, travailler en équipe est ton avantage.",
                    "Coeur Chanceux 3: ouvrir ton coeur aujourd'hui attire un soutien venant d'où tu t'y attends le moins."
                ],
                '♦': [
                    "Carreau Chanceux 3: une petite action pratique aujourd'hui peut se transformer en un grand retour sur investissement.",
                    "Carreau Chanceux 3: ton oeil pour la valeur est aiguisé aujourd'hui, le meilleur choix se révèle clairement.",
                    "Carreau Chanceux 3: les ressources s'alignent en ta faveur, un effort modeste produit des résultats significatifs.",
                    "Carreau Chanceux 3: revoir tes finances aujourd'hui débloque une étape intelligente que tu n'avais pas vue.",
                    "Carreau Chanceux 3: une opportunité cachée est proche, un second regard la transforme en gain réel.",
                    "Carreau Chanceux 3: la sagesse pratique te guide maintenant, l'efficacité s'accumule en bonne fortune."
                ],
                '♣': [
                    "Trèfle Chanceux 3: le progrès constant est ta formule gagnante aujourd'hui, garde le rythme et fais confiance.",
                    "Trèfle Chanceux 3: chaque petit pas d'aujourd'hui s'accumule silencieusement en quelque chose d'extraordinaire.",
                    "Trèfle Chanceux 3: la patience est ton porte-bonheur, la constance l'emporte sur l'urgence aujourd'hui.",
                    "Trèfle Chanceux 3: cette tâche presque terminée franchira la ligne d'arrivée brillamment aujourd'hui.",
                    "Trèfle Chanceux 3: bâtir des bases solides aujourd'hui te prépare pour un bond sans effort demain.",
                    "Trèfle Chanceux 3: ton endurance brille aujourd'hui, l'effort soutenu apporte une récompense satisfaisante."
                ]
            },
            'zh-CN': {
                '♠': [
                    "今日幸运签：黑桃 3。做决定会特别果断，工作与学习容易一次到位。",
                    "今日幸运签：黑桃 3。今天行动力很强，卡住的事情有机会快速突破。",
                    "今日幸运签：黑桃 3。今天很适合处理最难的那件事，完成率偏高。",
                    "今日幸运签：黑桃 3。专注力上升，短时间内就能把重点做完。",
                    "今日幸运签：黑桃 3。你今天的判断很准，适合拍板定案。",
                    "今日幸运签：黑桃 3。思路清晰，复杂问题会被你拆解得很漂亮。"
                ],
                '♥': [
                    "今日幸运签：红心 3。人际运上升，适合主动联系重要的人，会有好回应。",
                    "今日幸运签：红心 3。今天说出的善意会被放大，反馈会很快出现。",
                    "今日幸运签：红心 3。关系运走强，适合修复小误会、拉近距离。",
                    "今日幸运签：红心 3。你今天很有感染力，容易获得支持。",
                    "今日幸运签：红心 3。今天适合合作，彼此加成感特别明显。",
                    "今日幸运签：红心 3。开放心态会带来一个让你心情很好的消息。"
                ],
                '♦': [
                    "今日幸运签：方块 3。财运与机会运偏强，小机会可能带来大收获。",
                    "今日幸运签：方块 3。今天对价格与价值的判断特别准。",
                    "今日幸运签：方块 3。小小尝试会带来实际回报，值得主动出击。",
                    "今日幸运签：方块 3。今天是小投入大回报的一天。",
                    "今日幸运签：方块 3。你今天很容易找到高性价比的选择。",
                    "今日幸运签：方块 3。好机会正在靠近，记得主动伸手接住。"
                ],
                '♣': [
                    "今日幸运签：梅花 3。稳定运很强，手上的计划有望扎实推进。",
                    "今日幸运签：梅花 3。今天适合打基础，持续做就会看到明显成果。",
                    "今日幸运签：梅花 3。你的耐心今天就是幸运，慢慢来反而最快。",
                    "今日幸运签：梅花 3。稳稳前进就是王道，成果正在堆高。",
                    "今日幸运签：梅花 3。今天很适合完成差最后一步的任务。",
                    "今日幸运签：梅花 3。今天是成长日，稳定就是最强幸运。"
                ]
            },
            'de': {
                '♠': [
                    "Glueckspik 3: deine Konzentration ist heute auf dem Hoehepunkt, fang mit dem Schwersten an und du wirst es meistern.",
                    "Glueckspik 3: dein Entscheidungsvermoegen glaenzt heute, vertrau deinem Instinkt und geh ohne Zögern voran.",
                    "Glueckspik 3: geistige Klarheit ist dein Verbuendeter, nutze diesen produktiven Zustand voll aus.",
                    "Glueckspik 3: komplexe Probleme vereinfachen sich heute, geh ruhig ran und die Loesung zeigt sich.",
                    "Glueckspik 3: deine Energie ist auf dem Hoechststand, ein starker Start heute erzeugt grossen Schwung.",
                    "Glueckspik 3: Intuition und Logik gehen heute Hand in Hand, deine Entscheidungen werden ins Schwarze treffen."
                ],
                '♥': [
                    "Gluecksherz 3: menschliche Verbindungen bluehen heute auf, mach den ersten Schritt und du wirst Waerme erhalten.",
                    "Gluecksherz 3: deine Worte haben heute eine besondere Kraft, drueck Dankbarkeit aus und beobachte die Wirkung.",
                    "Gluecksherz 3: Kommunikation fliesst muehelos, sogar schwierige Themen lassen sich gut loesen.",
                    "Gluecksherz 3: deine Empathie ist heute dein Superpower, Menschen fuehlen sich sicher in deiner Naehe.",
                    "Gluecksherz 3: Zusammenarbeit vervielfacht heute die Ergebnisse, Teamwork ist dein Vorteil.",
                    "Gluecksherz 3: dein Herz heute zu oeffnen zieht Unterstuetzung aus unerwarteten Richtungen an."
                ],
                '♦': [
                    "Glueckskarr 3: eine kleine praktische Tat heute kann sich in einen grossen Ertrag verwandeln.",
                    "Glueckskarr 3: dein Gespuer fuer Wert ist heute geschaerft, die beste Option offenbart sich klar.",
                    "Glueckskarr 3: Ressourcen reihen sich zu deinen Gunsten, ein bescheidener Aufwand bringt bedeutende Ergebnisse.",
                    "Glueckskarr 3: deine Finanzen heute zu ueberpruefen entsperrt einen klugen naechsten Schritt.",
                    "Glueckskarr 3: eine verborgene Chance ist in der Naehe, ein zweiter Blick verwandelt sie in echten Gewinn.",
                    "Glueckskarr 3: praktische Weisheit leitet dich jetzt, Effizienz anhaeufen wird zu Glueck."
                ],
                '♣': [
                    "Glueckskreuz 3: stetiger Fortschritt ist heute deine Erfolgsformel, behalte den Rhythmus und vertraue.",
                    "Glueckskreuz 3: jeder kleine Schritt heute stapelt sich leise zu etwas Aussergewoehlichem.",
                    "Glueckskreuz 3: Geduld ist dein Glueckszeichen, Bestaendigkeit uebertrifft heute die Dringlichkeit.",
                    "Glueckskreuz 3: diese fast fertige Aufgabe wird heute glaenzend die Ziellinie ueberqueren.",
                    "Glueckskreuz 3: heute solide Grundlagen zu legen bereitet dich auf einen muhelosen Sprung morgen vor.",
                    "Glueckskreuz 3: deine Ausdauer glaenzt heute, anhaltende Bemuehungen bringen eine befriedigende Belohnung."
                ]
            },
            'it': {
                '♠': [
                    "Picche Fortunate 3: la tua concentrazione è al massimo oggi, inizia dal più difficile e ce la farai.",
                    "Picche Fortunate 3: la tua capacità decisionale brilla oggi, fidati del tuo istinto e vai avanti senza esitare.",
                    "Picche Fortunate 3: la chiarezza mentale è tua alleata, sfrutta questo stato di flusso produttivo al meglio.",
                    "Picche Fortunate 3: i problemi complessi si semplificano oggi, affrontali con calma e la soluzione apparirà.",
                    "Picche Fortunate 3: la tua energia è al culmine, un inizio forte oggi crea un grande slancio.",
                    "Picche Fortunate 3: intuizione e logica vanno di pari passo oggi, le tue scelte colpiranno nel segno."
                ],
                '♥': [
                    "Cuori Fortunati 3: le connessioni umane fioriscono oggi, fai il primo passo e riceverai calore.",
                    "Cuori Fortunati 3: le tue parole hanno un potere speciale oggi, esprimi gratitudine e osserva l'effetto.",
                    "Cuori Fortunati 3: la comunicazione scorre senza sforzo, anche gli argomenti difficili si risolvono bene.",
                    "Cuori Fortunati 3: la tua empatia è il tuo superpotere oggi, le persone si sentono al sicuro vicino a te.",
                    "Cuori Fortunati 3: la collaborazione moltiplica i risultati oggi, lavorare in team è il tuo vantaggio.",
                    "Cuori Fortunati 3: aprire il tuo cuore oggi attrae supporto da dove meno te lo aspetti."
                ],
                '♦': [
                    "Quadri Fortunati 3: una piccola azione pratica oggi può trasformarsi in un grande ritorno.",
                    "Quadri Fortunati 3: il tuo occhio per il valore è affilato oggi, la scelta migliore si rivela chiaramente.",
                    "Quadri Fortunati 3: le risorse si allineano a tuo favore, uno sforzo modesto produce risultati significativi.",
                    "Quadri Fortunati 3: rivedere le tue finanze oggi sblocca un passo intelligente che non avevi visto.",
                    "Quadri Fortunati 3: una opportunità nascosta è vicina, uno sguardo in più la trasforma in guadagno reale.",
                    "Quadri Fortunati 3: la saggezza pratica ti guida ora, l'efficienza si accumula in buona fortuna."
                ],
                '♣': [
                    "Fiori Fortunati 3: il progresso costante è la tua formula vincente oggi, mantieni il ritmo e fidati.",
                    "Fiori Fortunati 3: ogni piccolo passo di oggi si accumula silenziosamente in qualcosa di straordinario.",
                    "Fiori Fortunati 3: la pazienza è il tuo portafortuna, la costanza supera l'urgenza oggi.",
                    "Fiori Fortunati 3: quel compito quasi finito attraverserà magnificamente il traguardo oggi.",
                    "Fiori Fortunati 3: costruire basi solide oggi ti prepara per un salto senza sforzo domani.",
                    "Fiori Fortunati 3: la tua resistenza brilla oggi, lo sforzo sostenuto porta una ricompensa soddisfacente."
                ]
            },
            'pt-PT': {
                '♠': [
                    "Espada da Sorte 3: o teu foco está no ponto máximo hoje, começa pelo mais difícil e vais conseguir.",
                    "Espada da Sorte 3: a tua capacidade de decisão brilha hoje, confia no instinto e avança sem hesitar.",
                    "Espada da Sorte 3: a clareza mental é tua aliada, aproveita este estado de fluxo produtivo ao máximo.",
                    "Espada da Sorte 3: problemas complexos simplificam-se hoje, aborda-os com calma e verás a solução.",
                    "Espada da Sorte 3: a tua energia está no auge, um começo forte hoje cria um grande impulso.",
                    "Espada da Sorte 3: intuição e lógica andam de mãos dadas hoje, as tuas escolhas vão acertar em cheio."
                ],
                '♥': [
                    "Copas da Sorte 3: as conexões humanas florescem hoje, dá o primeiro passo e receberás carinho.",
                    "Copas da Sorte 3: as tuas palavras têm um poder especial hoje, expressa gratidão e observa o efeito.",
                    "Copas da Sorte 3: a comunicação flui sem esforço, até os assuntos difíceis se resolvem bem.",
                    "Copas da Sorte 3: a tua empatia é o teu superpoder hoje, as pessoas sentem-se seguras perto de ti.",
                    "Copas da Sorte 3: a colaboração multiplica os resultados hoje, trabalhar em equipa é a tua vantagem.",
                    "Copas da Sorte 3: abrir o teu coração hoje atrai apoio de onde menos esperavas."
                ],
                '♦': [
                    "Ouros da Sorte 3: uma pequena ação prática hoje pode transformar-se num grande retorno.",
                    "Ouros da Sorte 3: o teu olho para o valor está afiado hoje, a melhor opção revela-se claramente.",
                    "Ouros da Sorte 3: os recursos alinham-se a teu favor, um esforço modesto produz resultados significativos.",
                    "Ouros da Sorte 3: rever as tuas finanças hoje desbloqueia um passo inteligente que ainda não tinhas visto.",
                    "Ouros da Sorte 3: uma oportunidade escondida está próxima, uma segunda vista transforma-a em ganho real.",
                    "Ouros da Sorte 3: a sabedoria prática guia-te agora, a eficiência acumula-se em boa fortuna."
                ],
                '♣': [
                    "Paus da Sorte 3: o progresso constante é a tua fórmula vencedora hoje, mantém o ritmo e confia.",
                    "Paus da Sorte 3: cada pequeno passo de hoje acumula-se silenciosamente em algo extraordinário.",
                    "Paus da Sorte 3: a paciência é o teu amuleto de sorte, a constância supera a urgência hoje.",
                    "Paus da Sorte 3: essa tarefa quase concluída vai cruzar a linha de chegada lindamente hoje.",
                    "Paus da Sorte 3: construir bases sólidas hoje prepara-te para um salto sem esforço amanhã.",
                    "Paus da Sorte 3: a tua resistência brilha hoje, o esforço sustentado traz uma recompensa satisfatória."
                ]
            },
            'nl': {
                '♠': [
                    "Gelukkige Schoppen 3: je concentratie is vandaag op zijn hoogtepunt, begin met het moeilijkste en je gaat slagen.",
                    "Gelukkige Schoppen 3: je beslissingsvermogen schittert vandaag, vertrouw op je instinct en ga zonder aarzelen vooruit.",
                    "Gelukkige Schoppen 3: mentale helderheid is je bondgenoot, benut deze productieve staat ten volle.",
                    "Gelukkige Schoppen 3: complexe problemen vereenvoudigen vandaag, pak ze kalm aan en de oplossing verschijnt.",
                    "Gelukkige Schoppen 3: je energie is op het maximum, een sterke start vandaag creëert een geweldige impuls.",
                    "Gelukkige Schoppen 3: intuïtie en logica gaan vandaag hand in hand, je keuzes zullen raak zijn."
                ],
                '♥': [
                    "Gelukkige Harten 3: menselijke verbindingen bloeien vandaag, neem het initiatief en je ontvangt warmte terug.",
                    "Gelukkige Harten 3: je woorden hebben vandaag een speciale kracht, druk dankbaarheid uit en observeer het effect.",
                    "Gelukkige Harten 3: communicatie stroomt moeiteloos, zelfs moeilijke onderwerpen worden goed opgelost.",
                    "Gelukkige Harten 3: je empathie is vandaag je superkracht, mensen voelen zich veilig in jouw nabijheid.",
                    "Gelukkige Harten 3: samenwerking vermenigvuldigt vandaag de resultaten, teamwerk is jouw voordeel.",
                    "Gelukkige Harten 3: je hart vandaag openen trekt steun aan van waar je het minst verwacht."
                ],
                '♦': [
                    "Gelukkige Ruiten 3: een kleine praktische actie vandaag kan uitgroeien tot een grote beloning.",
                    "Gelukkige Ruiten 3: je oog voor waarde is vandaag scherp, de beste keuze openbaart zich duidelijk.",
                    "Gelukkige Ruiten 3: middelen richten zich in jouw voordeel, een bescheiden inspanning levert betekenisvolle resultaten.",
                    "Gelukkige Ruiten 3: je financiën vandaag herzien ontgrendelt een slimme volgende stap die je nog niet had gezien.",
                    "Gelukkige Ruiten 3: een verborgen kans is dichtbij, een tweede blik transformeert het in echte winst.",
                    "Gelukkige Ruiten 3: praktische wijsheid leidt je nu, efficiëntie stapelt zich op tot goed geluk."
                ],
                '♣': [
                    "Gelukkige Klaveren 3: gestage vooruitgang is vandaag je winnende formule, houd het ritme vast en vertrouw.",
                    "Gelukkige Klaveren 3: elke kleine stap van vandaag stapelt zich stilletjes op tot iets buitengewoons.",
                    "Gelukkige Klaveren 3: geduld is je geluksbrenger, standvastigheid overtreft urgentie vandaag.",
                    "Gelukkige Klaveren 3: die bijna voltooide taak zal vandaag schitterend de finishlijn passeren.",
                    "Gelukkige Klaveren 3: vandaag een stevige basis bouwen bereidt je voor op een moeiteloze sprong morgen.",
                    "Gelukkige Klaveren 3: je uithoudingsvermogen schittert vandaag, volgehouden inspanning brengt een bevredigende beloning."
                ]
            },
            'ru': {
                '♠': [
                    "Счастливая пика 3: твоя концентрация сегодня на пике, начни с самого трудного и ты справишься.",
                    "Счастливая пика 3: твоя способность принимать решения сияет сегодня, доверяй инстинктам и двигайся вперёд.",
                    "Счастливая пика 3: умственная ясность твой союзник, используй это продуктивное состояние на полную.",
                    "Счастливая пика 3: сложные проблемы упрощаются сегодня, подходи спокойно и решение появится.",
                    "Счастливая пика 3: твоя энергия на максимуме, сильный старт сегодня создаёт огромный импульс.",
                    "Счастливая пика 3: интуиция и логика идут рядом сегодня, твои выборы попадут точно в цель."
                ],
                '♥': [
                    "Счастливое сердце 3: человеческие связи расцветают сегодня, сделай первый шаг и получишь тепло в ответ.",
                    "Счастливое сердце 3: твои слова имеют особую силу сегодня, вырази благодарность и наблюдай за эффектом.",
                    "Счастливое сердце 3: общение течёт без усилий, даже сложные темы решаются хорошо.",
                    "Счастливое сердце 3: твоя эмпатия твоя суперсила сегодня, люди чувствуют себя в безопасности рядом с тобой.",
                    "Счастливое сердце 3: сотрудничество умножает результаты сегодня, командная работа твоё преимущество.",
                    "Счастливое сердце 3: открыть сердце сегодня притягивает поддержку оттуда, откуда не ожидаешь."
                ],
                '♦': [
                    "Счастливый бубен 3: небольшое практическое действие сегодня может превратиться в большую отдачу.",
                    "Счастливый бубен 3: твой взгляд на ценность острый сегодня, лучший выбор раскрывается ясно.",
                    "Счастливый бубен 3: ресурсы выстраиваются в твою пользу, скромные усилия дают значимые результаты.",
                    "Счастливый бубен 3: пересмотр финансов сегодня открывает умный следующий шаг, который ты ещё не видел.",
                    "Счастливый бубен 3: скрытая возможность рядом, второй взгляд превращает её в реальную прибыль.",
                    "Счастливый бубен 3: практическая мудрость ведёт тебя сейчас, эффективность накапливается в удачу."
                ],
                '♣': [
                    "Счастливая трефа 3: стабильный прогресс твоя выигрышная формула сегодня, держи ритм и доверяй.",
                    "Счастливая трефа 3: каждый маленький шаг сегодня тихо накапливается во что-то выдающееся.",
                    "Счастливая трефа 3: терпение твой талисман удачи, постоянство превосходит срочность сегодня.",
                    "Счастливая трефа 3: та почти завершённая задача сегодня блестяще пересечёт финишную черту.",
                    "Счастливая трефа 3: закладывать прочный фундамент сегодня готовит тебя к лёгкому прыжку завтра.",
                    "Счастливая трефа 3: твоя выносливость сияет сегодня, устойчивые усилия приносят удовлетворяющую награду."
                ]
            },
            'pl': {
                '♠': [
                    "Szczesliwy pik 3: twoja koncentracja jest dziś na szczycie, zacznij od najtrudniejszego i odniesiesz sukces.",
                    "Szczesliwy pik 3: twoja zdolność podejmowania decyzji błyszczy dziś, ufaj instynktom i idź naprzód bez wahania.",
                    "Szczesliwy pik 3: jasność umysłu jest twoim sprzymierzeńcem, wykorzystaj ten produktywny stan w pełni.",
                    "Szczesliwy pik 3: złożone problemy upraszczają się dziś, podejdź spokojnie i rozwiązanie się pojawi.",
                    "Szczesliwy pik 3: twoja energia jest na maksimum, mocny start dziś tworzy ogromny impuls.",
                    "Szczesliwy pik 3: intuicja i logika idą dziś w parze, twoje wybory trafią w sedno."
                ],
                '♥': [
                    "Szczesliwe serce 3: ludzkie połączenia kwitną dziś, zrób pierwszy krok i otrzymasz ciepło w zamian.",
                    "Szczesliwe serce 3: twoje słowa mają dziś wyjątkową moc, wyraź wdzięczność i obserwuj efekt.",
                    "Szczesliwe serce 3: komunikacja płynie bez wysiłku, nawet trudne tematy rozwiązują się dobrze.",
                    "Szczesliwe serce 3: twoja empatia to dziś twoja supermoc, ludzie czują się bezpiecznie w twoim pobliżu.",
                    "Szczesliwe serce 3: współpraca mnoży dziś wyniki, praca zespołowa jest twoją przewagą.",
                    "Szczesliwe serce 3: otwarcie serca dziś przyciąga wsparcie skąd się najmniej spodziewasz."
                ],
                '♦': [
                    "Szczesliwy karo 3: małe praktyczne działanie dziś może przerodzić się w duży zwrot.",
                    "Szczesliwy karo 3: twoje oko na wartość jest dziś wyostrzone, najlepszy wybór ujawnia się wyraźnie.",
                    "Szczesliwy karo 3: zasoby ustawiają się na twoją korzyść, skromny wysiłek przynosi znaczące rezultaty.",
                    "Szczesliwy karo 3: przegląd finansów dziś odblokowuje inteligentny następny krok, którego jeszcze nie widziałeś.",
                    "Szczesliwy karo 3: ukryta szansa jest blisko, drugi rzut oka zamienia ją w realny zysk.",
                    "Szczesliwy karo 3: praktyczna mądrość prowadzi cię teraz, efektywność kumuluje się w szczęście."
                ],
                '♣': [
                    "Szczesliwy trefl 3: stały postęp to twoja formuła sukcesu dziś, utrzymaj rytm i zaufaj procesowi.",
                    "Szczesliwy trefl 3: każdy mały krok dziś cicho kumuluje się w coś niezwykłego.",
                    "Szczesliwy trefl 3: cierpliwość to twój talizman szczęścia, wytrwałość przewyższa pilność dziś.",
                    "Szczesliwy trefl 3: to prawie ukończone zadanie dziś wspaniale przekroczy linię mety.",
                    "Szczesliwy trefl 3: budowanie solidnych fundamentów dziś przygotowuje cię na łatwy skok jutro.",
                    "Szczesliwy trefl 3: twoja wytrwałość błyszczy dziś, utrzymany wysiłek przynosi satysfakcjonującą nagrodę."
                ]
            },
            'tr': {
                '♠': [
                    "Sansli Macalar 3: bugun konsantrasyonun zirvededir, en zor olandan basla ve basariya ulasacaksin.",
                    "Sansli Macalar 3: karar verme becerin bugun parilamaktadir, icguduune guvenerek tereddut etmeden ilerle.",
                    "Sansli Macalar 3: zihinsel netlik mucadele ortagindir, bu uretken durumdan tam anlamiyla yaralan.",
                    "Sansli Macalar 3: karmasik problemler bugun basitlesir, sakin bir sekilde yaklasirsan cozum ortaya cikar.",
                    "Sansli Macalar 3: enerijn maksimumda, bugun guclu bir baslangi buyuk bir ivme yaratir.",
                    "Sansli Macalar 3: sezi ve mantik bugun el ele yurur, tercihlerinin hedefi bulacagini goreceksin."
                ],
                '♥': [
                    "Sansli Kupa 3: insan baglarilari bugun cicek acar, ilk adimi at ve sicakligini geri alacaksin.",
                    "Sansli Kupa 3: sozlerinin bugun ozel bir gucu var, minnetini ifade et ve etkiyi gozlemle.",
                    "Sansli Kupa 3: iletisim zahmetsizce akar, zor konular bile iyi cozume kavusur.",
                    "Sansli Kupa 3: empatin bugun supergucun, insanlar yaninda kendilerini guvende hisseder.",
                    "Sansli Kupa 3: isbirligi bugun sonuclari katlar, takim calismasi avantajindir.",
                    "Sansli Kupa 3: bugun kalbini acmak beklenmedik yerden destek cekmektedir."
                ],
                '♦': [
                    "Sansli Karo 3: bugun kucuk pratik bir hareket buyuk bir getiriye donusebilir.",
                    "Sansli Karo 3: deger icin gozun bugun keskindir, en iyi secenegin net sekilde ortaya cikiyor.",
                    "Sansli Karo 3: kaynaklar lehinize dizilir, mevzi bir caba anlamli sonuclar dognrur.",
                    "Sansli Karo 3: bugun finansini gozden gecirmek daha once gormedigen akilli bir adim acar.",
                    "Sansli Karo 3: gizli bir firsat yakin, ikinci bir bakis onu gercek kazanca donusturur.",
                    "Sansli Karo 3: pratik bilgelik seni simdi yonlendiriyor, verimlilik sans birikmesine donusur."
                ],
                '♣': [
                    "Sansli Sinekler 3: istikrarli ilerleme bugun kazanma formuldur, ritinimi koru ve surece guvenerelim.",
                    "Sansli Sinekler 3: bugunku her kucuk adim sessizce olagandisiligi biriktirir.",
                    "Sansli Sinekler 3: sabir sans talismanidindir, tutarlilik bugun aciliyeti gecer.",
                    "Sansli Sinekler 3: neredeyse biten o gorev bugun bitis cizgisini parlak sekilde gececek.",
                    "Sansli Sinekler 3: bugun sag lam temeller atmak seni yarin rahat bir sicramaya hazirlar.",
                    "Sansli Sinekler 3: dayaniklilin bugun parlior, surdurulen caba tatmin edici bir odule getiriyor."
                ]
            },
            'vi': {
                '♠': [
                    "Bich Thu 3: su tap trung cua ban hom nay dat dinh cao, hay bat dau voi viec kho nhat va ban se thanh cong.",
                    "Bich Thu 3: kha nang quyet dinh cua ban toa sang hom nay, hay tin vao ban nang va tien ve phia truoc.",
                    "Bich Thu 3: su trong sang trong tu duy la dong minh cua ban, hay tan dung trang thai lam viec hieu qua nay.",
                    "Bich Thu 3: cac van de phuc tap don gian hoa hom nay, tiep can binh tinh va giai phap se xuat hien.",
                    "Bich Thu 3: nang luong cua ban dang o muc cao nhat, mot khoi dau manh me hom nay tao ra da lon.",
                    "Bich Thu 3: truc giac va logic di doi hom nay, cac lua chon cua ban se trung dich."
                ],
                '♥': [
                    "Co Thu 3: cac moi ket noi con nguoi no ro hom nay, hay buoc di truoc va ban se nhan lai su am ap.",
                    "Co Thu 3: loi noi cua ban co suc manh dac biet hom nay, hay bay to long biet on va quan sat hieu qua.",
                    "Co Thu 3: giao tiep trao doi de dang, ngay ca cac chu de kho cung duoc giai quyet tot.",
                    "Co Thu 3: su dong cam la sieu nang luc cua ban hom nay, moi nguoi cam thay an toan ben ban.",
                    "Co Thu 3: su hop tac nhan doi ket qua hom nay, lam viec nhom la loi the cua ban.",
                    "Co Thu 3: mo long hom nay thu hut su ung ho tu noi ban it mong doi nhat."
                ],
                '♦': [
                    "Ro Thu 3: mot hanh dong thuc te nho hom nay co the tro thanh mot phan thuong lon.",
                    "Ro Thu 3: con mat danh gia gia tri cua ban sac ben hom nay, lua chon tot nhat lo ra ro rang.",
                    "Ro Thu 3: cac nguon luc xep hang theo huong co loi cho ban, mot no luc vua phai dem lai ket qua co y nghia.",
                    "Ro Thu 3: xem lai tai chinh hom nay mo khoa buoc di thong minh tiep theo ma ban chua thay.",
                    "Ro Thu 3: mot co hoi an giau dang o gan, nhin them lan nua bien no thanh loi ich thuc su.",
                    "Ro Thu 3: su khon ngoan thuc te dang huong dan ban bay gio, hieu qua tich luy thanh may man."
                ],
                '♣': [
                    "Nhep Thu 3: tien bo on dinh la cong thuc chien thang cua ban hom nay, giu nhip va tin tuong qua trinh.",
                    "Nhep Thu 3: moi buoc nho hom nay lang le tich luy thanh dieu gi do phi thuong.",
                    "Nhep Thu 3: kien nhan la linh vat may man cua ban, su kien tri vuot qua su cap bach hom nay.",
                    "Nhep Thu 3: nhiem vu gan hoan thanh do se vuot qua vach dich mot cach tuyet voi hom nay.",
                    "Nhep Thu 3: xay dung nen mong vung chac hom nay chuan bi cho ban mot cuoc nhay vot de dang ngay mai.",
                    "Nhep Thu 3: su ben bi cua ban toa sang hom nay, no luc bren bi mang lai phan thuong xung dang."
                ]
            }
        };
        const T1_LIGHTNING_SEED_POOL = [3985675060,3982829972,2298888814,3195012780,4011494069,2056475807,1232696522,20119014,2857546389,3866612120,1385958802,1299566027,2118860312,2649725055,2442915301,622924752,2250352444,4004664888,3133236198,3785138568,241862232,165457331,3735468170,4091931259,285979594,3670809843,2258942425,3329095953,65145276,3562609239,4141844672,185087143,656213899,986201113,581750782,512689842,661908342,2239472354,746290582,1154284940,3437008697,2543980444,2519424450,3253952779,902378163,245540596,2622809252,1903694006,609573004,2584749811,274330884,2359830979,4161811036,606202146,1418806711,1120488320,28032035,419275274,550254432,169711010,411936282,3022615479,3052146862,654033287,1958213292,3526836024,579603267,2879166916,1062374137,1348224492,1871682997,3714258755,781020490,80097966,175586609,286286653,1281839718,3554079159,1031292830,1537252887,1297259452,548938751,2953292187,2878790243,2635386066,1388936608,4266878902,4045842853,2942870192,413131022,4074854228,1170029727,1954871942,2493617065,4019014175,530829478,1227714851,199579145,1575590769,1490038264,1180560854,473503142,204743475,2359950511,3421545950,3283659192,767697549,1266906659,2543725671,2413944340,2323495679,489113987,3198832916,2553452072,977433046,406878861,3035418681,2526804892,2856379747,64967933,2979714036,1797418919,2595854231,2321237845,2580848373,2808746757,3382006039,709209662,1809550042,3929920898,398212784,1102088636,1744275255,1501073546,4168105203,908038747,1825213993,3448709028,3605260701,888575995,1315992502,2258426289,3178052395,1743192810,720075963,1990665508,1495528995,3234206819,368224369,2085340087,3278109137,1120706765,2070609095,2261481743,55042941,2907817637,3850298610,281320130,3999235177,3716192385,3074487891,1350029535,3000389736,1303914302,1011460759,1777492290,3848520288,1099157909,2486646388,603188602,2944173027,1688752957,1299399617,3080444354,3132166808,3143031287,327076147,3759432956,2617470280,833186245,2885399426,1426578733,753854600,510770370,709776619,3008865359,450776040,1972482551,3470014699,3692743545,3037501462,3666162969,1481962806,3333650180,2969201228,2338594397,3844094617,2175947234,4278907076,3846041177,2215237827,3047477191,3631982178,4213179856,2285520208,3615508381,2925818739,2592206838,1337424063,3352556264,685351612,697956275,2494470409,589041613,1072561724,3910650231,3335638202,4216682988,136281298,799935548,868934434,3487183945,3323638322,955331505,224829759,455170964,3107246820,2465628040,3158016694,872440966,1698583626,3732451992,876601973,177176071,1289715819,3913208775,4229478587,1116142375,1528810844,2559828510,3351769676,596891034,2324148825,192747922,2061385837,2516048916,2428473118,1627984030,2795430524,1423704185,2929736132,415350915,1591410926,1891440228,2879916660,2938611736,3929843488,1151709451,3124566224,1962882748,2552437034,1163107506,3733044556,3116834001,677300604,4080200654,3469697208,2577917121,3160475453,3525509101,3971878390,4252553910,2325769859,831062366,1653594305,2247551919,793331166,3294450052,1903110454,2021652994,74253632,4094112486,1119984204,635644211,323383186,3438834273,4123551069,2652762585,3035659114,2558435668,2615325690,2207019331,2755242790,3869190239,688540679,2949893406,705576993,2746394016,709936783,1960253386,1726728505,3614490968,3782105632,1353756164,1775022344,3131388254,1300176040,3260366194,1732395726,1725827625,872574898,1279946899,31490485,839283871,724139701,4075811232,950750510,1407796366,1240373949,1258456797,4110933451,2517456415,4043307786,1917764522,2982996614,677355642,3373118085,3029891873,2490959855,3558535224,2029340886,2995899752,4175342594,2706290004,3767229653,2896376321,2155656529,556430162,2910728491,3127838994,137531660,2236451719,1802617405,4041021694,2627976446,3111835575,3029557581,2954646897,1846904889,2352778079,2840878415,3757322431,1264138046,909017527,4293953365,2866822579,1517076587,413002758,2147577864,1600903262,2612758573,24593216,3912140409,2082702663,2612634383,2658688173,1921142623,2857433121,1567438184,871676142,2252988570,3166725536,271761754,2458290850,2144616034,2699681336,2473641610,2978389106,3245244622,1192735269,3931997748,1349761051,4269260433,3430398703,2065179193,2876661394,2957075386,4193138217,3509747947,639158817,2190015739,2906062277,1842485010,1655900573,1526947674,2462155974,3671532596,3615230439,3590632318,1000083010,3271550184,2572817801,1841170056,2186943823,834681548,2604343685,1471766569,1250586582,263748957,398708915,2915237270,4231220781,1738064526,3876359188,1624415295,1070724358,3262796435,2749822898,1904576491,3949710835,3574930948,2297410272,2159583621,3240769692,990566225,4127760165,845308215,338414257,827212690,3478394976,1193157888,3414834047,4042430368,4053163354,2162847198,4159276458,1229844021,650349667,829581354,689312948,2078764266,1452848383,558562001,2344743736,4002048091,1054178146,3753466340,2796588277,4048219343,4269367826,2635841522,2065734492,1921051970,1978710698,3846362859,3482919245,4179904829,3353311116,1022577246,1823556082,2088665666,780161353,719157562,754016623,3954880727,2737202015,3218120271,1612993998,2000412355,3546763572,176866120,249848700,1254107656,2049241033,3845082783,383752942,1873712449,2534902939,2478747263,1916744008,92218821,2916037990,29249627,2680472536,2103475658,1275526297,2257613207,1406096410,2910943718,1497442820,566912622,1747467350,622710096,740792063,1977640018,35002427,312041832,3846381829,3030050319,289115404];
        const T2_WARMUP_SEED_POOL = [3097655017,1727173452,3478230067,3641310239,1753693765,348039944,800072882,4156992265,657407468,3274135279,1271531407,2648456464,616853053,1372607267,3452517021,2873737808,4114642583,2841628433,386400969,3473127892,3963258831,3724339457,1232643436,2921994695,2718548915,759538091,1738088181,3624913534,3595115635,628824472,2251309943,2288365429,3404251103,2297774385,3790148519,683313145,3853737562,952140615,515558557,447075268,3507416306,2540183931,2886557578,3599197531,1375410701,3904423155,2289964283,4070354874,3396568092,3079255786,3525170525,781284307,3744755753,2598017436,856099892,9328700,1842009752,3108088432,1729881331,3194847442,1602637531,1237936200,2281852287,1737217318,671909189,3722505687,1709841833,1086814602,493365595,711850277,917530007,2202346456,549303737,4104296745,1037759999,2974847178,2317725622,1640887087,2987276075,1868061633,4063980147,665322285,2928583049,3485650538,3281217391,3794004093,875719360,1576333548,2050053297,2451637135,1131694445,1579275803,3082133992,2403126216,297720245,1039119972,228351071,132759148,952320198,1165276813,498518038,3436927866,1998088023,3208536285,2599642796,3540642570,1632316520,1187424570,627548237,2641720390,2988756985,2967783021,3025772940,2181715171,3540626026,1352814194,4184328879,1445103380,2479653843,2244635184,3969665538,1843987114,1404330501,3635699608,2984160230,3248996253,3421109335,590914859,3676491516,3902736427,1189807501,2513418944,1178957030,4002709353,2453544644,1380121299,2450110013,3728278218,1513556183,1658094432,2102393043,914157469,3193644951,2205390051,2099095240,1621889271,1290996130,2258905980,2313667400,3419913340,3928009373,619364443,652187844,1128471680,1869494773,2490173075,4102086229,3694801170,1631366782,2926404060,480764225,4250812736,4069211227,2872072500,1794979022,3659675810,1637209186,411211972,1786383546,3064885895,1592627809,4257698452,2205405990,1787088645,3800997230,3489744234,879602614,88945055,4266280384,4210000483,1106500346,1658994799,2283013330,626400441,2939328978,1408216924,2462273684,1119524647,3945993596,1781958165,533596250,1091271282,3775344855,413418758,1565611079,284343311,3833871226,690284222,1042264362,2709986189,1124583018,2456801650,127553471,1292972450,4282768730,2384922261,37883772,834704476,1082402742,3875848898,4137885569,3506917677,2805766357,3421867089,2397558184,1506620303,4263491141,734136522,1786374052,3520965458,416268935,4086045588,1162508400,3469168336,1272495075,788068167,2852614394,41759516,3957381923,2594855784,3254318379,3087586167,1171543819,3906230566,2507500249,4135885680,127043394,3356914834,3461228591,2914749074,2406418044,22076531,246193903,698415339,1703126726,2137456896,3080600152,3546728244,326135008,3125287369,1584309209,945876927,1329395950,2390788226,1284231455,2925022937,401503577,811391953,2652045017,3599062983,3497141740,3818178789,3732871137,2391202205,1822154101,3483260846,2187835921,139768097,2375182267,1623357805,449530046,1539653396,511526973,3418435198,4013302890,80443155,513212673,888707559,1223120935,3608160714,3351043188,4095003665,488337619,2834982492,3249328722,2638208962,740154130,1355439343,494249517,205822801,2425952304,1982907194,3346840715,2829121731,3504921283,3656434905,150150747,2672140000,1440246863,3694299837,1074657273,694451087,2660326367,4167291264,1512182975,4273100724,3104340559,1701426961,3123211808,3919745666,3595980915,2973801489,4241087651,2260064473,3977257936,787779071,642093115,3461367766,39605163,3573101590,2543564841,2172156454,2524483224,315405557,2470247131,3975900868,3775932605,2758642702,226974578,2196855793,4077827494,3122735561,236961553,3319665159,471464030,3641311501,181137709,1431205639,3003684183,953721872,2650654682,1199026656,4277711567,2893531880,478342665,3795815591,3711829753,657627212,3405591227,102051700,4145442480,2664671384,908772658,2056139924,1163559142,329047509,3893892813,1673121616,771757881,38256916,2470632440,2924489688,1278007207,2431398155,1644854551,1220269924,4004854764,1611927093,1031785766,1030474141,353694003,2818546342,1958892798,1680680150,410920409,1123192040,278712905,3693904448,4141148089,1005676871,3615342376,3949535648,198881116,2756487144,3566709903,2757835637,1482509804,3190625755,3622025175,2246359093,4287327723,3144215853,327426106,652983194,1520753181,3562157693,3033526250,571589312,1301778479,1815887805,409938112,2963857923,1526267336,2076605675,83618178,3614462412,3705511059,2728114053,1861858792,679118984,1385659861,4113931367,3656295955,4086833472,3120796463,1684023337,3791383350,1780808652,3056408405,3991957575,2342590785,1785870722,734098487,722898820,2059423700,4267375163,3413971355,351876246,1243013101,2036399597,396783900,3155876843,237518047,3034605618,3546772486,2599477040,3248715391,3695816863,3738930091,534557091,4202607834,223275141,2942394107,2435033637,3588313999,831831960,3556958794,2671650128,2561165471,1104695745,10109236,3963112362,551899207,967286985,3243288184,1091276978,2254272321,69650342,2243129395,777580233,2563083279,1170705330,62090226,2864072383,3825808675,2211230174,2954832451,385787920,793895899,1310426379,824553854,244003543,1461010487,2017656467,2681157273,2981463625,1045387197,1437110746,1795261517,374448722,1112987203,3784143842,3113740053,532844009,2095933356,29373720,51474429,1693894941,4026641890,2234209498,476292294,3617574773,1784240722,3781763685,4292788443,1994019093,4129590284,4205554934,934922188,1230692787];
        const T3_BRIDGE_SEED_POOL = [2009067328,55002917,1582663867,850762309,2063681883,3322711918,3027912746,1436042361,3349066236,2129112476,355190203,2205976324,269069436,3969734640,2524300955,1301368143,1022982219,2029128462,2064152064,3738303497,2074906436,3923998856,4240340392,1681656332,3622372188,1910152379,2201864074,2315210702,1343365604,3808299030,3042096847,1717146263,3902559869,2698095310,2733929659,3895471512,1918618882,370355799,2324048456,2359442863,3696236515,1063990936,1759104620,783343937,1380413745,2530823304,621325067,3953512164,2877111006,534612360,3063733924,3781636921,2469599539,2803448995,4175721422,1534971109,2286619823,1027547161,2667769628,788988202,1965249124,557059700,1975289235,131017881,3213078618,1416480735,735243822,4276920692,3071598248,3242404046,1703261095,1083651269,3973151748,372133110,628322112,2941777947,2884368362,1804220599,3656270741,1635985502,522810117,2814476503,103981358,1553067817,3215011503,3185674955,2469630421,2340058697,3460364557,402041870,2880221145,1052659934,1198543573,503153852,1956333305,3998101145,2241162806,1410923124,1772989634,969086294,3082761402,426868274,2446557489,764119593,4033605867,2411112699,734644473,2964129616,3498209578,599849613,534876513,3893986677,48281260,1737240061,3318474487,1893261627,722984841,2416550243,1121904190,2377195225,2577530717,42866621,3812784760,1082591475,3724661470,33804900,834853811,609149765,1926426136,3360689242,1632646857,1009085665,3426458726,253665959,3043556955,2137278004,3635210355,1435441003,735525119,1191681506,3397430909,1317275188,507781765,664574198,3404981823,3761366340,2401959709,4234184098,1847084772,2163601332,3348673365,810174895,201206261,1277642943,2871257696,749953989,1782911872,1109751496,3464370712,248736919,1618400989,779545593,1585937825,362398261,839982519,1369695948,1536869462,4111042399,204590795,2393492505,2702252892,2609850297,3212422955,3912629368,1344908552,3191228076,1903414920,4154829600,2877659016,2404504206,3593850648,2832539991,2871351075,1609889027,3161702655,1522373589,843577124,3138191436,2537036888,2828838844,1357590338,2091258905,1723113635,1244035070,3427545659,1764273964,367991365,4049943986,965392167,1157649161,2272838007,2387931830,2245802519,665225577,415336552,1801368555,1193926927,2942911347,320160284,1194529258,8786213,2793556297,3961136007,2728787377,799342653,2999837640,237639098,443536421,1302204342,956401440,3144397636,3016279240,1870278096,3876443165,3747034812,1793216448,3693017068,2598363322,652147342,4189137475,80638961,3123679147,4066423688,2734413768,3070936734,3792443328,363512193,1954814408,2672921539,2391341577,1812233680,324984723,2520553808,1877106822,2505888360,1846126621,3180239891,3667831076,4140397065,645541486,570516041,106367410,2188941247,3293147288,3074062694,842179540,1794678574,2911952705,481051354,618697545,1987877002,3183838929,414460706,3170947321,300206245,2954452870,193968171,339142114,265480960,906408647,4048815822,2754154880,3300607903,2505948003,798599687,566718392,2627914483,2605192041,3796843171,3082981667,958231032,1169019917,3965658708,3698160287,294920832,997979656,171041546,125183621,552165971,3927807118,2493269143,700383689,555642068,3823955253,1636238379,2736147782,2105664323,3425734905,824237238,2487804365,3825028964,2759531819,3120636683,457428126,2751427867,1217055676,4232597723,3569434253,3792721708,1554010286,1529815892,3727035732,1370514199,3333282855,3411391108,4135120837,4122217019,8561470,132958938,455893799,1272848157,632072910,2269442398,620103296,3929454479,4266000793,665906157,2462533132,1470800359,3972530231,3700576722,658163348,707355442,1774858795,2043057065,3200251541,693633744,1483764236,3389031359,2638971615,2544046790,2599824396,2274786821,4184026356,1161357519,306654557,1788999447,2228824564,334964407,724430513,3724118577,4007164953,526858136,232839275,2998799427,1707523205,95260058,2510253714,201573478,2577989179,249023082,262189789,733122005,566662594,3898347557,3700026358,2871247263,799935900,1927771540,1240240161,2767128213,1216810664,3438854229,276518784,250716796,1302012496,4084956540,20716747,3113308025,2926496030,2364954723,332339915,3341863417,1922503424,177134987,4043923938,1567711751,1823550614,2094194801,888975974,3451205000,2280075879,4152492821,525291882,433191873,1425994446,1828693475,1570807171,1375287244,991598266,2574892605,1625784105,1523048589,632858086,1309032978,3743004140,3983134478,1814744494,1248512590,836992143,1554842748,3579853671,1294442100,3561160095,1685725363,1458322654,3492066653,2980058917,4058360221,1569391717,3403472805,2051714747,2402797402,4113281242,1608935977,3278009030,105799000,3737517551,372701812,3352989379,4175623883,1947536095,2595092328,1842338796,4213247420,2484439295,3190092778,4081844752,348048850,3393947373,3666444903,2806131594,2149184511,2051021122,3933720041,2910088252,3119586878,1564708009,2124376460,815924196,3870209481,3947144372,1499117938,2967946301,3440479002,4119636189,2492171370,3465160128,3242021282,2282412440,4004102865,1862745652,2783116507,504009252,840730853,3792673924,1687754402,1953577588,248864718,538020611,409102909,2306032341,3910167091,3978207185,1139389991,3997152598,3424390014,2412828313,138275889,382651166,2685741510,3894615231,1036769061,1100032606,1846968313,3375458988,2751757772,2870298024,1047127698,3110036036,4080503899,325082508,4184067292,129769365,825946671,1598546406,247182284,2458658845,820869194,800058886];
        const T4_FLOW_SEED_POOL = [1298280026,3753753276,407700188,1839829871,3693130620,723079681,937783646,592184639,534400353,1439562066,2886429288,450472796,2769303321,1216442304,4163767122,2010018480,3842770944,958541557,2437798234,4254587676,392352902,2867009704,2707790303,974908988,608545553,3429738779,1705024317,3261994666,3738631877,287115644,1572970437,1761460057,3736934321,3052306137,1427020028,644545206,3848609750,2366075038,527572948,2960131832,849605800,2737788492,277011277,913397387,4128634068,308037031,3057863064,2453429021,2702774095,3576663799,2722894120,825270258,4124191836,1561677648,3094866232,2122003032,3461550435,3051572372,338097107,3572153097,798219517,3597280795,1492740963,2163392714,3309229249,527476919,2151324932,142841262,1592241054,3130375336,3672410564,3207313216,1251516379,1262993934,533268287,2753390703,109899742,2730746084,1606494927,2257040458,2345467054,3692428677,2509698121,1292846382,2446135979,69445147,2077427025,1908053444,861888921,3923029464,693746387,2262748801,3694421714,3069307366,38585612,1684056184,1143092345,137738549,2239426436,2774891929,1411790208,113594943,206617779,3488748545,3620650814,2177719651,2166377921,2850531120,1313859313,1270049205,3289354965,597992433,3539155531,3256978633,3931345627,2821280216,266816923,3681282840,1347496649,3377608031,3966697843,1670380880,760887189,512014445,1633879073,973320761,4040665964,807918453,146090217,1836275389,1355389865,3669380974,253958651,3263662755,1518548839,2648250853,681732752,1730722709,3818398181,1188667730,1899149023,3592018088,2215171782,410627943,591484112,1081387417,284788403,2518349142,814912588,4229977303,903250289,3421910439,3330728789,1043696193,3018978792,1268974550,4146047398,4001208899,2557811082,814826836,2267559775,2741172904,4269436568,1100538322,1067641465,3677156189,547934556,430027956,1102809332,4093776000,4254211982,2948386083,1945562110,1121367071,345075782,877477168,1159569464,1002493227,2695903923,1407204651,4142066474,282404151,3177668462,1057651995,3228616224,1203038151,2033122193,2571057631,2917504725,424050454,3109397652,1650619842,2639243001,669283963,4245083794,3878668279,909669099,1208131500,462248606,2400208203,285551308,666697953,673590191,4069620897,2817027635,368824165,2923615594,3291389962,2758242097,986109056,1609383377,1579036463,3811024924,3803023561,1533135157,561659386,178638387,1887242943,2579231760,4859507,4149298856,227199135,1674338465,2137621756,2296290152,214712417,1624467445,831562758,3667378097,72518618,3237270106,3554134579,2555529000,1909521127,1833460400,1932391939,4111944797,343083583,4122453918,1495997738,1435719377,945958779,3610109203,2548512932,3590209648,3225050052,4256795477,443206166,92892176,167714082,603188204,2849161418,926516928,1605004338,2869194795,2176606181,779317348,3546492034,623632088,2664549564,1066193152,617068953,681924741,796233829,3735702819,711381726,1295634343,3989067919,2511975236,1086827339,4140291070,1402252654,2970160965,1999193201,3729706173,875329298,2337594813,549944151,3772405989,1272626369,4040225471,27406288,2300470488,2498924894,2701035074,1269824873,3306229522,3046751282,2128193923,3189167768,1383838932,1818545050,1328128413,560035400,3269598675,2219399889,3497519479,778461880,3058221062,2558682277,1574668657,2415341141,694602052,3356937921,3226955041,2315192333,3597341793,712630679,3572830088,3044265016,2509050475,1997920951,2331672058,1927053236,607680825,2259794948,787679972,1336709730,3584104412,3434477517,1897572192,1385743656,1845365053,3535855168,2554780663,2137851476,2419235834,4147639554,1253594535,1688742351,2436272482,3601923827,2792386368,1900854,598909950,3875277922,369307856,3682964423,2147071841,1605836799,868313534,462244494,2292362377,3023095317,4249118870,2834415248,2103760618,1681377693,2251028040,1655149193,3869553315,1014841986,4226224592,1869508299,1506614433,239958756,695248670,870391300,4016388812,1412999286,1534003094,3200314778,2737494155,500313294,4156109857,4020521219,16422355,2683716627,792531122,1497184211,1700914735,4116848584,10121337,3429698602,3626098288,1355545255,589638298,657602890,2532317094,2861011352,2604312768,1048573740,909677889,2033306714,3310050961,3332068488,776720367,3309776373,700125872,3427444193,2754097658,2002721526,558925098,4142271284,4074475195,483545261,579495495,1150291852,1254631588,1876196715,2307418314,3160284204,3683732031,2724948110,179497756,1201660736,2982828510,1433363821,2921165788,3478757776,2207568203,156452618,3451663226,742220756,1321612690,834359719,4276457681,4208179282,921337183,734219241,3702097055,2665183855,3493505762,58246565,930450509,2805714136,2033342982,1406272836,1682598282,2079915014,3514177675,148743621,2747141859,3482753323,3358071112,357325310,2671744317,3850716569,1204358928,805100142,2023183192,1260453385,562234435,386114320,972053020,236081783,2864899805,3255604414,641407894,430449610,444784371,2102525286,2908665410,3070278306,539372003,2165786594,4161454162,835953793,2048414522,2656551422,323582889,319658363,1063197793,2359737668,2664845473,3862610916,1455344902,4280325238,2168421975,31872690,2501777163,2265553166,2970067108,2023704323,3953733650,1857710711,866746271,3305703741,664084597,161498712,3226928135,3910699942,2704116896,354531586,3886988500,1359139217,3157999148,161589904,514856135,1779254287,513448013,687268370,3334658627,2980519072,1156845916,2463783577,109542140,157614003,1755234246,2829128498];
        const T5_CHALLENGE_SEED_POOL = [1575988454,4216486762,2345035864,1501964397,2189317460,3764639145,2100174905,1111886212,197584842,894219385,1494972724,4065944417,2119733405,3515411811,3998149689,3809496902,1374046738,1829302825,3923841613,2085873228,2418346064,644730477,827781881,2589075838,1587942882,2876435642,1334606651,1115751327,3203848490,2142663131,2835697029,3655064283,2824922715,1973047526,2580898501,2745635602,1245851619,563892209,1312087735,250869760,293152224,348460996,4175256551,3165102755,3202083463,2668503398,4161163932,3750738794,360371382,2705342455,3006632934,1757450826,1215612072,4237791959,74044762,2346109691,4035697555,1283332882,2663070927,3233731779,3771608018,4116309190,3058768568,2117357005,405381328,3180937996,776935769,1930015801,692086150,2899441798,1121366005,3109437903,1290268404,1276014560,3372758232,782323190,2132984354,3171566319,3364678770,3842228253,134261646,3517007226,697697957,578054207,3635784370,4180190624,1378758449,594200344,3712271256,3005123506,638054563,3899837339,3398776857,1554575405,1333166454,59675010,3493923520,212362261,1035852563,1437010696,217422987,1374175895,2173592398,3433419005,1766677229,3355933344,3701474108,567500428,1365175159,2180304168,1979378826,551421201,1551847545,2361396840,3668841000,3254222516,2707876059,3883382384,2092928214,529887354,2823242533,491202062,371563788,2454239090,1011430194,4184660593,1827300967,2708858018,2347345978,1950450688,1011987889,3564686698,4043938153,188827701,138937812,219341838,3959488167,1781863833,2639004142,3757699308,3060525011,2392746660,286741388,2638966814,3847479822,3903143382,2961335774,310431740,4278260031,3019214863,2596776088,1196530484,1221915402,1878214043,2302862644,1817743547,3606330881,3409780577,1607799582,2948760513,20961010,993446998,1935163696,2028797507,85524489,2520025150,1609127801,2454038373,1735336261,301387237,466604368,3595789696,3120863089,1368676215,2796353616,2927513334,1470329066,1036142397,2437506530,2337205631,2777394168,1928857287,4256576469,2965534704,3038054850,2750420368,3596515982,1424168136,2257175262,79010654,1703953197,139466148,3065684144,1656281358,2136465954,1332568463,3991458525,2276737934,2734962049,3478154614,3687903078,3105680355,1993947284,1105662722,1164340875,1107332663,1196372930,1080293,2897613698,2851317165,4190263676,2875756940,3956604329,1646426146,1940854141,751809899,931544864,635091500,3922574736,1269211480,2557319812,1670003195,2469819588,956459722,4171994663,1696893147,3124956701,370579995,2949740070,2579884214,4043435281,3333541329,3471259733,308787015,3868183930,607059681,3155326486,192613212,235934693,207652841,3668867169,3189356081,2252491334,2026997196,3736279131,1290918810,1579576805,4246874597,1100992918,3498388347,4013015376,3467406512,870611380,3370003,1760951956,3186104774,1553406677,371084288,1744376505,2112426736,2506951946,3526167428,295487490,592370515,585250237,2922477343,3281341826,1580071189,2570651521,1620305916,3142399842,6306139,4070009400,4089272148,108718102,3880372632,1376811512,748260356,1487448430,1057084567,2037925922,3687005103,4092332092,1084239890,468497157,3779831201,2612389997,943548310,3878240586,3828107513,1064823816,4078912476,640909579,2102067898,2572657668,10976286,3169858768,2606830974,2806662491,1051573982,4206855872,752524395,1336181679,1080770929,888551092,3245632440,25876799,2843415907,3056081236,2029875051,3667385325,2140113542,3260972396,2576208112,2839492917,1068461419,4034836405,987626224,469019877,2570493614,1985495045,3716904932,814404075,3649435937,3541375062,622284760,4222802784,2339022532,719264087,1066080213,1365168727,3412228870,937336982,1623883213,1920283214,1637266721,195058657,3866121560,2531602899,4119592488,15311468,3057044658,4041731345,3638824305,1062236997,2586456301,874763503,1122445905,3431554526,2626825253,3471226647,3572929375,732108677,3492725584,64585837,218500171,2408750523,2462783636,1613532396,3290188747,2473915157,4067658340,2205057691,2752742570,3245780283,2884567142,2024695403,1373779349,2416395848,3932100231,2904422802,2934705092,1438285421,171317974,3038932342,692814136,754150609,775252318,3788992783,62830726,2966063010,3915217679,2740928730,3263250279,4105156948,1938519360,3345178654,3655137717,582448411,3113751061,1578365912,2958649760,1424941756,576909485,659885358,983510003,2791518424,976315013,572946167,1932142779,703163445,3901872633,3146314934,1242341211,1166590564,4249782691,2687560973,3118090230,844135294,806399947,65940421,629342878,2082361688,790094078,528207054,1734383797,3452390020,1131563406,2422582446,3420853802,2812043602,513516564,144935283,2018620458,3351791354,3254016637,2581905704,1025724222,330699023,1401163087,2367413160,2302285180,4135030536,3224343707,1295658715,910787053,1236801764,144875871,346481899,3746818697,420258805,919104003,2793573180,689835722,413657090,2881932344,3748794082,1189736796,3388429125,1885820836,3321465968,669296669,3245031819,2869178418,3306340952,1074463804,2984007444,458093909,723556972,1751125764,1693385929,2735824563,3987576717,1396880738,2231229843,1098685545,1900778876,2255461640,2698801364,1298728866,2130001152,947973701,4038823155,3940679762,2778386543,3608038925,3107166136,539185975,2911910285,1574802645,1471955121,3005167537,1714341795,3057577790,3002004161,1595071120,3209232464,2169356658,3957272216,3572663057,3805578295,4224167259,201455462,2350677083,422950058,1983071782,965136868,3301627990,408694459,256637986];
        const COMBO_MASTER_SEED_POOL = [78,102,214,1074,1303,1668,1818,1921,2498,2605,2933,3121,3245,3497,3923,4283,4327,4417,4679,4744,4999,5408,5894,6180,6448,6988,7509,7619,7794,8258,8508,8569,8785,9793,9905,9949,10646,10853,10886,11159,12568,13199,13292,13354,13361,13623,13933,13949,13950,14146,14454,15043,15450,15849,16303,16642,16673,17131,17139,17233,17282,17542,18148,18914,19080,19736,19899,20196,20325,20545,20640,20964,21161,21349,21432,21443,22249,22514,22734,22830,23077,23205,23708,23793,23822,24300,24314,24370,24831,25180,25401,25403,25423,25441,25660,25661,25949,26341,26395,26425,26436,26684,26697,26996,27532,27667,28043,28273,28276,28550,28802,28818,29068,29097,29104,29117,29215,29273,29402,29416,30386,30708,30714,30940,30975,31817,31946,32456,33545,33759,33783,34119,34329,34769,34981,35453,35595,35880,36146,36604,36881,36916,37297,37375,37665,37686,37775,37796,37877,38513,38647,38845,39780,40671,40802,40911,40949,41341,42328,42671,42708,42805,42977,42997,43311,43704,43919,43938,44361,44633,44644,44962,45030,45144,45421,45681,45853,46030,46143,46412,46446,46505,46575,46891,47316,47688,48143,48277,48438,48754,48781,49129,49213,49487,49717,50343,50382,50403,50517,50603,50800,51214,51351,51580,51862,51968,52119,52568,52749,53459,53595,53635,53784,54141,54208,54361,55405,55431,55452,55524,55577,55794,55865,56011,56034,56166,56225,56526,56623,56813,56962,57323,57332,57438,57820,57876,58059,58204,58580,59062,59550,59664,59851,60256,60548,60735,60763,60768,60774,60967,61094,61184,61708,61799,62061,62090,62826,62892,63055,63275,63315,63844,63960,64049,64172,64396,64456,64492,64569,64896,64902,64937,65026,65540,65940,66065,66066,66329,66832,66847,66851,67083,67543,67627,68248,68621,68684,69505,69559,70134,70141,70465,70590,70640,70662,70680,71043,71181,72303,72419,73109,73627,73754,73991,74408,74582,74731,74917,75337,75378,75426,75966,76199,76234,76385,76615,76733,76819,77769,77976,78000,78150,78836,79534,80751,80801,81341,81769,81810,82062,82766,83349,83375,83489,83925,84092,84123,84150,84180,84555,84694,84732,85108,85129,85511,85558,85696,85972,86020,86049,86570,86572,86573,86878,86912,87080,87112,87118,87285,87399,87506,87520,87850,87925,88166,88279,88367,88385,88487,88839,88887,88958,88970,89021,89479,89496,89582,90478,90694,90856,91176,92092,92216,92611,92644,92750,92779,92851,93541,93652,94112,94165,94322,94409,94639,94908,94946,94958,94976,95025,95116,95177,95562,95662,96098,96154,96276,96828,96852,97066,97080,97217,97243,97997,98267,98582,98641,98812,98861,99112,99399,99425,99455,99459,99493,99591,99665,99891,100484,100619,101233,101303,101724,102047,102244,102347,102561,102689,102747,102760,102819,103345,103431,103774,103826,103834,103861,104071,104629,104837,104889,104893,105034,105191,105252,105849,105953,105957,106144,106162,106170,106329,106577,106692,107035,107075,107150,107241,107548,107603,107642,107862,108346,109299,109520,109783,110000,110003,110358,110685,111183,111408,111914,112178,112230,112272,112304,112730,112744,113037,113614,113701,113712,113823,113936,114015,114329,114586,114910,115696,115753,115765,115906,116265,116300,117180,117192,117319,117386,117777,117813,117847,118207,118308,118530,118566,118700,119010,119481,119555,119691,119872,119964,120322,120466,120789,120902,121148,121268,121390,121606,121920,122207,122332,122498,122522,122712,122983,123398,123500,123574,123592,123686,123734,123795,124516,124570,124745,124766,124855,124983,125257,126028,126093,126227,126810,126849,127052,127099,127150,127366,127483,127782,128010,128362,128390,128704,128740,128831,129280,129443,129591,129824,129826,130252,130314,131008,131128,131199,131215,131325,132126,132160,132190,133130,133237,133412,133523,133546,133573,133711,134925,135172,135928,136206,136268,136303,136744,137674,137780,137921,138167,138205,138267,138591,138683,139337,140245,140299,140519,140773,140793,140875,140915,141135,141293,141449,141468,141725,142640,142823,142967,143025,143443,143548,143551,143791,143873,144003,144164,144413,144708,144871,144881,145054,145326,145380,146108,146189,146569,146690,146756,146873,146940,147546,148089,148479,148895,148908,149125,149141,149248,149317,149724,149975,149991,150273,150967,151016,151340,151695,151703,152265,152306,152380,152713,153446,153534,153547,153557,153785,154289,155219,155245,155371,155839,155923,156385,156386,156408,156495,156688,156703,156880,157106,157352,157385,157672,157710,157783,157948,158329,158359,158505,158859,158901,159250,159348,159583,159708,160033,160107,160708,160865,161014,161087,161125,161438,161516,161523,161776,162259,162430,162499,162549,162708,162787,164052,164521,164972,165029,165177,165266,165933,166076,166110,166165,166201,166832,166936,168018,168046,168151,169159,169255,169284,169921,169993,170326,170464,170696,171269,171404,171437,171998,172310,172393,173071,173225,173570,173599,173749,173926,174703,175222,175281,175538,175593,175725,176262,176479,176701,176907,176920,176949,177417,177797,177859,177880,178065,178068,178171,178527,178700,178848,178865,180035,180374,180397,180748,181051,181197,181573,181598,181785,182169,182412,182493,182622,182910,183034,183076,183564,183741,183841,183857,183934,183960,184419,184528,184621,184793,184949,185210,186089,186165,186406,186554,186747,187209,187247,187365,187424,187694,188679,189041,189057,189067,189083,189093,189116,189543,190182,190402,190869,191104,191163,191478,192218,192483,192493,192713,192724,192726,193118,193177,193855,194201,194320,194635,194793,194919,195018,195256,195273,195317,195617,195785,195988,196283,196314,196522,196577,196752,196888,197153,197218,197707,197796,197920,198886,198926,199135,199240,199317,199377,199570,200168,200201,200528,200629,200636,201241,201656,202044,202298,202540,202772,202808,202857,202884,203218,203255,203266,203612,203728,203842,203982,204025,204327,204519,204530,204923,205272,205440,205646,206245,206365,206496,206543,206693,206727,207456,207552,207649,207900,208049,208190,208301,209014,209413,209471,209657,209778,210189,210245,210255,210348,210540,210729,210837,210838,210910,211366,211479,211568,211614,211884,211895,212073,212276,212689,212762,212964,213073,213437,213613,213645,214016,214412,214585,214802,215011,215223,215279,215455,215463,216003,216020,216229,216657,217109,217129,217316,217519,217725,218175,218453,218743,218812,218859,219345,219441,219735,219885,220062,220164,220661,221435,221530,222121,222249,222526,223912,223945,224204,224465,224665,224787,225212,225250,225362,225758,226019,226085,226150,226179,226427,226582,226809,226978,227412,227492,227754,227814,227815,228244,228350,228471,228975];
        const EZ_FIRST_SEED_POOL = T1_LIGHTNING_SEED_POOL;
        const G2_FLOW_SEED_POOL = T2_WARMUP_SEED_POOL;
        const G3_SOFT_CHALLENGE_SEED_POOL = T3_BRIDGE_SEED_POOL;
        const G15_BRIDGE_SEED_POOL = T4_FLOW_SEED_POOL;
        const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const SUPPORTS_VIBRATE = !IS_IOS && typeof navigator.vibrate === 'function';
        const DEFAULT_SETTINGS = { sound: true, vibration: true, animationSpeed: 'normal', locale: detectInitialLocale(), highContrast: false, miiPeek: true, recycleAnim: true, bgm: false, sumHelper: false, dailyNotif: false, cardRankScale: 1, cardSuitScale: 1 };
        const DEFAULT_ACHIEVEMENTS = {
            wins: 0,
            zeroClearWins: 0,
            streakShield: 0,
            maxCombo: 0,
            bestMoves: null,
            bestTimeSec: null,
            currentStreak: 0,
            longestStreak: 0,
            lastWinDate: '',
            noUndoWins: 0,
            suitWins: { spade: false, heart: false, diamond: false, club: false },
            fullSweepWins: 0,
            dailyWins: 0,
            comboGameWins: 0
        };
        const CLEAR_MOVE_PHASES = Object.freeze({
            WINDUP: 200,
            FLYOUT: 150,
            IMPACT: 200,
            SETTLE: 800
        });
        let deck = [], slots = [], discardPile = [], clearedGroups = [];
        let selected = [], nextSlotIndex = 0, isBusy = false, historyStack = [], combo = 0, lastCleared = null, startTime = Date.now();
        let _gameEpoch = 0;
        const _slotRenderCache = {}; // slot.id -> fingerprint，用於 differential rendering
        let autoEliminateTimer = null;
        let winInterval = null, moveCount = 0, clearMoveCount = 0, maxCombo = 0, hasWon = false, deadlockShown = false;
        let magicMomentActive = false;
        let magicMomentTimer = null;
        let settings = { ...DEFAULT_SETTINGS };
        let achievements = { ...DEFAULT_ACHIEVEMENTS };
        let audioCtx = null;
        let tutorial = { active: false, step: 0 };
        let tutorialDeckMode = false;
        let winCardSuit = '';
        let lastFortuneText = '';
        let gameMode = 'normal';
        let undoUsedThisGame = false;
        let columnsCleared = 0;
        let columnsClearedSet = new Set(); // distinct slot ids cleared this game (for fullsweep)
        let dealCount = 0; // successful deal actions in this game
        let recycleCount = 0; // recycle actions in this game
        let columnClearEvents = []; // [{ slotId, dealCount, moveCount, elapsedSec }]
        let comboEventsThisGame = 0;
        let _slotCompressHidden = {}; // slotId → fixed hidden count for wave-compression
        let lastGameStats = null; // { timeStr, moves, combo }
        let dailyUndoCount = 0;
        let currentSeed = null;
        let currentGameGrade = 'g2'; // 'g2' | 'g3'，用於 BGM 切換
        let currentDifficultyTag = '';
        let lastDailyRankText = '';
        let developerMode = false;
        let seedCheatMode = false;
        let devTapCount = 0;
        let devTapTimer = null;
        let cheatTapCount = 0;
        let cheatTapTimer = null;
        let rewindSequenceActive = false;
        let rewindLockTagTimer = null;
        let comboFocusActive = false;
        let comboFocusTimer = null;

        // ── Extreme Challenge ──────────────────────────────────────────────
        const CHALLENGES_KEY = 'lucky3-challenges-v1';
        const CHALLENGE_LEVELS = [
            { id: 'shilian', name: '試煉', seed: 79548218, condition: 'no-undo', target: null,
              entryText: '前 27 張牌，沒有任何消除機會。你只能等待。禁止使用撤銷。',
              condText: '禁止使用撤銷',
              unlockCond: { type: 'wins', value: 3 } },
            { id: 'tianzhu', name: '天柱', seed: 620342323, condition: 'max-deals', target: 300,
              entryText: '某列牌堆將堆到 38 張高。你必須在 300 次發牌內撐過它。',
              condText: '發牌 ≤ 300',
              unlockCond: { type: 'challenge', value: 'shilian' } },
            { id: 'xingbao', name: '星爆', seed: 1267428763, condition: 'min-combo', target: 5,
              entryText: '這副牌藏著 8 連消的可能。找到它。達成 5 連消以上才算通關。但記住——每一次選牌都在改寫命運，選錯一張，前路盡斷。',
              condText: 'Combo ≥ 5',
              unlockCond: { type: 'challenge', value: 'tianzhu' } },
            { id: 'lunhui', name: '輪迴', seed: 895200815, condition: 'no-undo', target: null,
              entryText: '這副牌將洗牌 77 次，牌永遠回來。禁止使用撤銷。堅持到底。',
              condText: '禁止使用撤銷',
              unlockCond: { type: 'challenge', value: 'xingbao' } },
            { id: 'jufeng', name: '颶風', seed: 1685840387, condition: 'min-combo-triggers', target: 30,
              entryText: '這局會爆發 62 次連消。你必須親眼見證至少一半。達成 30 次 combo 觸發才算通關。',
              condText: 'Combo 觸發 ≥ 30',
              unlockCond: { type: 'challenge', value: 'lunhui' } },
            { id: 'yongheng', name: '永恆', seed: 1749873395, condition: 'none', target: null,
              entryText: '1387 張發牌。466 次消除。最後只剩一張 3。沒有額外條件——活下去就是勝利。',
              condText: '完成即通關',
              unlockCond: { type: 'all-others' } },
        ];
        let currentChallengeId = null;
        let challengeUndoViolated = false;
        let challengeDealCount = 0;
        let _pendingChallengeId = null;

        function loadChallengesData() {
            try { return JSON.parse(localStorage.getItem(CHALLENGES_KEY) || '{}'); }
            catch { return {}; }
        }
        function saveChallengesData(data) {
            localStorage.setItem(CHALLENGES_KEY, JSON.stringify(data));
        }
        function isChallengeCompleted(id) {
            return !!loadChallengesData()[id]?.completed;
        }
        function isChallengeUnlocked(id) {
            const lvl = CHALLENGE_LEVELS.find(c => c.id === id);
            if (!lvl) return false;
            const cond = lvl.unlockCond;
            if (!cond) return true;
            const data = loadChallengesData();
            if (cond.type === 'wins') return (achievements.wins || 0) >= cond.value;
            if (cond.type === 'challenge') return !!data[cond.value]?.completed;
            if (cond.type === 'all-others') return CHALLENGE_LEVELS.filter(c => c.id !== id).every(c => !!data[c.id]?.completed);
            return true;
        }

        function homeOpenChallengeSelect() {
            renderChallengeGrid();
            const overlay = document.getElementById('challenge-select-overlay');
            if (overlay) overlay.style.display = 'flex';
        }
        function closeChallengeSelect() {
            const overlay = document.getElementById('challenge-select-overlay');
            if (overlay) overlay.style.display = 'none';
        }

        function renderChallengeGrid() {
            const grid = document.getElementById('challenge-card-grid');
            if (!grid) return;
            const data = loadChallengesData();
            grid.innerHTML = CHALLENGE_LEVELS.map((lvl, i) => {
                const done = data[lvl.id]?.completed;
                const unlocked = isChallengeUnlocked(lvl.id);
                let hint = '';
                if (!unlocked) {
                    const cond = lvl.unlockCond;
                    if (cond.type === 'wins') hint = t('challenge.unlock_wins', { value: cond.value });
                    else if (cond.type === 'challenge') {
                        const prev = CHALLENGE_LEVELS.find(c => c.id === cond.value);
                        hint = t('challenge.unlock_stage', { name: t('challenge.' + cond.value + '.name') });
                    } else if (cond.type === 'all-others') hint = t('challenge.unlock_all');
                }
                const stateClass = done ? ' completed' : (!unlocked ? ' locked' : '');
                const icon = done
                    ? `<span class="challenge-card-done-icon">✦</span>`
                    : (!unlocked
                        ? `<span class="challenge-card-lock-icon">🔒</span>`
                        : `<span class="challenge-card-lock-icon">⚔</span>`);
                const badge = done ? `<span class="challenge-card-badge">${t('challenge.badge_coming')}</span>` : '';
                const hintEl = !unlocked ? `<div class="challenge-card-hint">${hint}</div>` : '';
                const click = unlocked ? `onclick="openChallengeEntry('${lvl.id}')"` : '';
                return `<div class="challenge-card${stateClass}" ${click}>
                    ${icon}
                    <div class="challenge-card-num">${t('challenge.stage', { n: i + 1 })}</div>
                    <div class="challenge-card-name">${t('challenge.' + lvl.id + '.name')}</div>
                    <div class="challenge-card-cond">${t('challenge.' + lvl.id + '.cond')}</div>
                    ${hintEl}${badge}
                </div>`;
            }).join('');
        }

        function openChallengeEntry(id) {
            const lvl = CHALLENGE_LEVELS.find(c => c.id === id);
            if (!lvl) return;
            if (!isChallengeUnlocked(id)) return;
            _pendingChallengeId = id;
            const nameEl = document.getElementById('challenge-entry-name');
            const textEl = document.getElementById('challenge-entry-text');
            const condEl = document.getElementById('challenge-entry-cond');
            if (nameEl) nameEl.textContent = t('challenge.' + lvl.id + '.name');
            if (textEl) textEl.textContent = t('challenge.' + lvl.id + '.entry');
            if (condEl) condEl.textContent = t('challenge.cond_prefix') + t('challenge.' + lvl.id + '.cond');
            const overlay = document.getElementById('challenge-entry-overlay');
            if (overlay) overlay.style.display = 'flex';
        }
        function closeChallengeEntry() {
            const overlay = document.getElementById('challenge-entry-overlay');
            if (overlay) overlay.style.display = 'none';
            _pendingChallengeId = null;
        }
        function startChallengeFromEntry() {
            const id = _pendingChallengeId;
            if (!id) return;
            closeChallengeEntry();
            closeChallengeSelect();
            hideHomeScreen(() => {
                startChallengeGame(id);
            });
        }

        function startChallengeGame(id) {
            const lvl = CHALLENGE_LEVELS.find(c => c.id === id);
            if (!lvl) return;
            isBusy = false;
            Object.keys(_slotRenderCache).forEach(k => delete _slotRenderCache[k]);
            _slotCompressHidden = {};
            const boardEl = document.getElementById('board');
            if (boardEl) boardEl.innerHTML = '';
            const fxLayer = document.getElementById('fx-layer');
            if (fxLayer) fxLayer.innerHTML = '';
            ParticleSystem.clear();
            ParticleSystem.resize();
            document.querySelector('.big-msg')?.remove();
            document.getElementById('win-overlay')?.remove();
            document.getElementById('deadlock-overlay')?.remove();
            document.getElementById('rewind-overlay')?.remove();
            clearRewindFocus();
            clearRewindLockTag();
            clearAutoEliminateTimer();
            if (comboFocusTimer) { clearTimeout(comboFocusTimer); comboFocusTimer = null; }
            comboFocusActive = false;
            currentChallengeId = id;
            challengeUndoViolated = false;
            challengeDealCount = 0;
            currentDifficultyTag = 'CHALLENGE';
            deck = [];
            discardPile = [];
            clearedGroups = [];
            gameMode = 'normal';
            currentSeed = lvl.seed;
            currentGameGrade = 'g2';
            BGM.setTrack(currentGameGrade);
            deck = buildSeededDeck(lvl.seed);
            slots = [
                { id: 0, cards: [], active: true },
                { id: 1, cards: [], active: true },
                { id: 2, cards: [], active: true },
                { id: 3, cards: [], active: true }
            ];
            selected = [];
            nextSlotIndex = 0;
            historyStack = [];
            combo = 0;
            lastCleared = null;
            startTime = Date.now();
            moveCount = 0;
            clearMoveCount = 0;
            dailyUndoCount = 0;
            updateUndoCountDisplay();
            maxCombo = 0;
            hasWon = false;
            deadlockShown = false;
            winCardSuit = '';
            undoUsedThisGame = false;
            columnsCleared = 0;
            columnsClearedSet = new Set();
            dealCount = 0;
            recycleCount = 0;
            columnClearEvents = [];
            comboEventsThisGame = 0;
            setUndoEnabled(false);
            updateHeaderModeTag();
            syncBoardScale();
            render();
            updateDiscard();
            resetDealHapticCount();
            updateChallengeHud();
            showChallengeHud(true);
            const epoch = ++_gameEpoch;
            const omenPromise = deck.length > 0
                ? showOmenCard(deck[deck.length - 1]?.suit || null)
                : Promise.resolve();
            omenPromise.then(() => {
                if (epoch !== _gameEpoch) return;
                return runOpeningDealAnimation(3, null, epoch);
            }).then(() => {
                if (epoch !== _gameEpoch) return;
                updateDiscard();
                saveGameState();
                if (!hasWon) checkDeadlock();
                startTutorial(false);
            });
        }

        function showChallengeHud(visible) {
            const el = document.getElementById('challenge-hud');
            if (!el) return;
            el.style.display = visible ? 'flex' : 'none';
        }

        function updateChallengeHud() {
            if (!currentChallengeId) return;
            const lvl = CHALLENGE_LEVELS.find(c => c.id === currentChallengeId);
            if (!lvl) return;
            const nameEl = document.getElementById('challenge-hud-name');
            const statusEl = document.getElementById('challenge-hud-status');
            const barWrap = document.getElementById('challenge-hud-bar-wrap');
            const bar = document.getElementById('challenge-hud-bar');
            if (nameEl) nameEl.textContent = t('challenge.' + lvl.id + '.name');
            let statusText = '';
            let barPct = 0;
            let showBar = false;
            if (lvl.condition === 'no-undo') {
                statusText = t('challenge.hud_no_undo');
            } else if (lvl.condition === 'min-combo') {
                const val = Math.min(maxCombo, lvl.target);
                statusText = t('challenge.hud_combo', { val, target: lvl.target });
                barPct = (val / lvl.target) * 100;
                showBar = true;
            } else if (lvl.condition === 'min-combo-triggers') {
                const val = Math.min(comboEventsThisGame, lvl.target);
                statusText = t('challenge.hud_triggers', { val, target: lvl.target });
                barPct = (val / lvl.target) * 100;
                showBar = true;
            } else if (lvl.condition === 'max-deals') {
                statusText = t('challenge.hud_deals', { val: challengeDealCount, target: lvl.target });
                barPct = (challengeDealCount / lvl.target) * 100;
                showBar = true;
            } else if (lvl.condition === 'none') {
                statusText = t('challenge.hud_deals_open', { val: challengeDealCount });
                showBar = false;
            }
            if (statusEl) statusEl.textContent = statusText;
            if (barWrap) barWrap.style.display = showBar ? 'block' : 'none';
            if (bar) bar.style.width = Math.min(100, barPct) + '%';
        }

        function checkChallengeConditionOnWin() {
            if (!currentChallengeId) return true;
            const lvl = CHALLENGE_LEVELS.find(c => c.id === currentChallengeId);
            if (!lvl) return true;
            if (lvl.condition === 'no-undo') return !challengeUndoViolated;
            if (lvl.condition === 'min-combo') return maxCombo >= lvl.target;
            if (lvl.condition === 'min-combo-triggers') return comboEventsThisGame >= lvl.target;
            if (lvl.condition === 'max-deals') return challengeDealCount <= lvl.target;
            return true;
        }

        function onChallengeWin(isLucky3) {
            if (!currentChallengeId || !isLucky3) return false;
            const passed = checkChallengeConditionOnWin();
            if (passed) {
                const data = loadChallengesData();
                if (!data[currentChallengeId]) data[currentChallengeId] = {};
                data[currentChallengeId].completed = true;
                data[currentChallengeId].completedAt = new Date().toISOString();
                saveChallengesData(data);
                // Unlock the matching cardback
                unlockCardBack(currentChallengeId);
                const lvl = CHALLENGE_LEVELS.find(c => c.id === currentChallengeId);
                setTimeout(() => showChallengeCompleteOverlay(currentChallengeId), 3600);
            } else {
                const lvl = CHALLENGE_LEVELS.find(c => c.id === currentChallengeId);
                setTimeout(() => showChallengeFailOverlay(t('challenge.fail_title_cond'), lvl ? t('challenge.' + lvl.id + '.cond') : ''), 3600);
            }
            return true;
        }

        function showChallengeCompleteOverlay(id) {
            const titleEl = document.getElementById('challenge-complete-title');
            if (titleEl) titleEl.textContent = t('challenge.' + id + '.name');
            const cb = CARD_BACKS.find(c => c.id === id);
            const cbName = cb ? (currentLocale === 'zh-Hant' ? cb.nameZH : cb.nameEN) : '';
            const cbEl = document.querySelector('.challenge-complete-cardback');
            if (cbEl) cbEl.textContent = t('challenge.complete_cardback', { name: cbName });
            const overlay = document.getElementById('challenge-complete-overlay');
            if (overlay) overlay.style.display = 'flex';
        }
        function closeChallengeComplete() {
            const overlay = document.getElementById('challenge-complete-overlay');
            if (overlay) overlay.style.display = 'none';
            endChallengeMode();
        }

        function showChallengeFailOverlay(title, msg) {
            const titleEl = document.getElementById('challenge-fail-title');
            const msgEl = document.getElementById('challenge-fail-msg');
            if (titleEl) titleEl.textContent = title;
            if (msgEl) msgEl.textContent = msg ? t('challenge.fail_cond_prefix') + msg : '';
            const overlay = document.getElementById('challenge-fail-overlay');
            if (overlay) overlay.style.display = 'flex';
        }
        function closeChallengeFailOverlay() {
            const overlay = document.getElementById('challenge-fail-overlay');
            if (overlay) overlay.style.display = 'none';
        }
        function retryChallengeFromFail() {
            const id = currentChallengeId;
            closeChallengeFailOverlay();
            endChallengeMode();
            if (id) startChallengeGame(id);
        }
        function quitChallengeFromFail() {
            closeChallengeFailOverlay();
            endChallengeMode();
            showHomeScreen();
        }

        function endChallengeMode() {
            currentChallengeId = null;
            challengeUndoViolated = false;
            challengeDealCount = 0;
            showChallengeHud(false);
        }

        function interceptChallengeUndo() {
            if (!currentChallengeId) return false;
            const lvl = CHALLENGE_LEVELS.find(c => c.id === currentChallengeId);
            if (!lvl || lvl.condition !== 'no-undo') return false;
            // Soft block: undo doesn't execute (caller checks return value), so the
            // player did NOT cheat — just toast the rule and keep their run alive.
            showChallengeUndoBlockedToast();
            return true;
        }

        function showChallengeUndoBlockedToast() {
            const old = document.getElementById('challenge-undo-toast');
            if (old) old.remove();
            const toast = document.createElement('div');
            toast.id = 'challenge-undo-toast';
            toast.className = 'challenge-undo-blocked';
            toast.textContent = t('challenge.undo_forbidden_toast');
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 1800);
        }
        // ── End Extreme Challenge ─────────────────────────────────────────

        function shuffleInPlace(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function mulberry32(seed) {
            let t = seed >>> 0;
            return function () {
                t += 0x6D2B79F5;
                let x = Math.imul(t ^ (t >>> 15), 1 | t);
                x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
                return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
            };
        }

        function shuffleWithRng(arr, rng) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(rng() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function normalizeCardScale(raw) {
            const n = Number(raw);
            if (!Number.isFinite(n)) return 1;
            return Math.min(2, Math.max(0.75, Math.round(n * 100) / 100));
        }

        function cardScalePercent(scale) {
            return Math.round(normalizeCardScale(scale) * 100);
        }

        function loadDailyNormalCycleState() {
            try {
                const raw = localStorage.getItem(DAILY_NORMAL_CYCLE_KEY);
                if (!raw) return { dayKey: '', runIndex: 0 };
                const parsed = JSON.parse(raw);
                return {
                    dayKey: typeof parsed.dayKey === 'string' ? parsed.dayKey : '',
                    runIndex: Number.isInteger(parsed.runIndex) && parsed.runIndex >= 0 ? parsed.runIndex : 0,
                };
            } catch (_) {
                return { dayKey: '', runIndex: 0 };
            }
        }

        function saveDailyNormalCycleState(state) {
            try {
                localStorage.setItem(DAILY_NORMAL_CYCLE_KEY, JSON.stringify(state));
            } catch (_) { }
        }

        function isComboMasterUnlocked() {
            // 解鎖 5 張以上牌背（含預設 2 張）= 已完成至少 3 項成就，視為進階收藏玩家
            return getUnlockedCardBacks().length >= 5;
        }

        function pickCuratedSeed() {
            const anyPool = [T1_LIGHTNING_SEED_POOL, T2_WARMUP_SEED_POOL, T3_BRIDGE_SEED_POOL,
                             T4_FLOW_SEED_POOL, T5_CHALLENGE_SEED_POOL].some(p => Array.isArray(p) && p.length > 0);
            if (!anyPool) return null;

            const today = toLocalDateKey();
            let state = loadDailyNormalCycleState();
            if (state.dayKey !== today) {
                state = { dayKey: today, runIndex: 0 };
            }

            const runIndex = state.runIndex;
            let seed = null;

            const pickFromPool = (pool, keySuffix) => {
                if (!Array.isArray(pool) || pool.length === 0) return null;
                const idx = dailySeedIndex(today + ':' + keySuffix) % pool.length;
                return pool[idx] >>> 0;
            };

            const comboMasterActive = Array.isArray(COMBO_MASTER_SEED_POOL) &&
                COMBO_MASTER_SEED_POOL.length > 0 && isComboMasterUnlocked();

            // 輪播：T1 → T2 → 循環 [T3, T4, T5]
            if (runIndex === 0) {
                currentGameGrade = 'g1';
                currentDifficultyTag = 'T1';
                seed = pickFromPool(T1_LIGHTNING_SEED_POOL, 't1');
            } else if (runIndex === 1) {
                currentGameGrade = 'g2';
                currentDifficultyTag = 'T2';
                seed = pickFromPool(T2_WARMUP_SEED_POOL, 't2');
            } else {
                const cycle = (runIndex - 2) % 3; // 0=T3, 1=T4, 2=T5
                if (cycle === 0) {
                    currentGameGrade = 'g2';
                    currentDifficultyTag = 'T3';
                    seed = pickFromPool(T3_BRIDGE_SEED_POOL, 't3-' + runIndex);
                } else if (cycle === 1) {
                    currentGameGrade = 'g2';
                    currentDifficultyTag = 'T4';
                    seed = pickFromPool(T4_FLOW_SEED_POOL, 't4-' + runIndex);
                } else {
                    currentGameGrade = 'g3';
                    currentDifficultyTag = comboMasterActive ? 'T5+' : 'T5';
                    if (comboMasterActive) {
                        seed = pickFromPool(COMBO_MASTER_SEED_POOL, 'combo-' + runIndex)
                            ?? pickFromPool(T5_CHALLENGE_SEED_POOL, 't5-' + runIndex);
                    } else {
                        seed = pickFromPool(T5_CHALLENGE_SEED_POOL, 't5-' + runIndex);
                    }
                }
            }

            state.dayKey = today;
            state.runIndex = runIndex + 1;
            saveDailyNormalCycleState(state);
            return seed;
        }

        function dailySeedIndex(dateKey) {
            if (!dateKey) return 0;
            let hash = 2166136261 >>> 0;
            for (let i = 0; i < dateKey.length; i++) {
                hash ^= dateKey.charCodeAt(i);
                hash = Math.imul(hash, 16777619) >>> 0;
            }
            return hash;
        }

        function dailyTierForDateKey(dateKey) {
            const d = new Date(`${dateKey}T12:00:00`);
            const dow = Number.isNaN(d.getTime()) ? 1 : d.getDay(); // 0=Sun..6=Sat
            const schedule = {
                1: 'easy',     // Mon
                2: 'normal',   // Tue
                3: 'normal',   // Wed
                4: 'hard',     // Thu
                5: 'normal',   // Fri
                6: 'normal',   // Sat
                0: 'hardplus', // Sun
            };
            return schedule[dow] || 'normal';
        }

        function buildDailyTierPools() {
            const nonEmpty = (arr) => Array.isArray(arr) && arr.length > 0;
            return {
                easy: nonEmpty(EZ_FIRST_SEED_POOL) ? EZ_FIRST_SEED_POOL : T1_LIGHTNING_SEED_POOL,
                normal: nonEmpty(G2_FLOW_SEED_POOL) ? G2_FLOW_SEED_POOL : T2_WARMUP_SEED_POOL,
                hard: nonEmpty(G3_SOFT_CHALLENGE_SEED_POOL) ? G3_SOFT_CHALLENGE_SEED_POOL : T3_BRIDGE_SEED_POOL,
                hardplus: nonEmpty(G15_BRIDGE_SEED_POOL) ? G15_BRIDGE_SEED_POOL : T4_FLOW_SEED_POOL,
                peak: nonEmpty(T5_CHALLENGE_SEED_POOL) ? T5_CHALLENGE_SEED_POOL : T4_FLOW_SEED_POOL,
            };
        }

        function pickDailySeed(dateKey = toLocalDateKey()) {
            const tier = dailyTierForDateKey(dateKey);
            const pools = buildDailyTierPools();
            const pool = pools[tier] || pools.normal;
            if (!pool) return null;
            const idx = dailySeedIndex(`${dateKey}:${tier}`) % pool.length;
            if (tier === 'easy') currentGameGrade = 'g1';
            else if (tier === 'normal' || tier === 'hard') currentGameGrade = 'g2';
            else currentGameGrade = 'g3';
            if (tier === 'easy') currentDifficultyTag = 'Daily Easy';
            else if (tier === 'normal') currentDifficultyTag = 'Daily Normal';
            else if (tier === 'hard') currentDifficultyTag = 'Daily Hard';
            else if (tier === 'hardplus') currentDifficultyTag = 'Daily Hard+';
            else currentDifficultyTag = 'Daily Peak';
            return pool[idx] >>> 0;
        }

        function buildSeededDeck(seed) {
            const fullDeck = [];
            suits.forEach(s => ranks.forEach(r => {
                fullDeck.push({ rank: r, suit: s, val: r === 'A' ? 1 : parseInt(r), color: s === '♥' || s === '♦' ? 'red' : 'black' });
            }));
            const rng = mulberry32(seed >>> 0);
            return shuffleWithRng(fullDeck, rng);
        }

        function createCard(rank, suit) {
            return { rank, suit, val: rank === 'A' ? 1 : parseInt(rank, 10), color: suit === '♥' || suit === '♦' ? 'red' : 'black' };
        }

        function fortuneBySuit(suit) {
            const pool = FORTUNE_POOL[currentLocale] || FORTUNE_POOL['en'];
            if (pool && pool[suit] && pool[suit].length > 0) {
                return pool[suit][Math.floor(Math.random() * pool[suit].length)];
            }
            // fallback to i18n single string
            const bySuit = {
                '♠': t('fortune.spade'),
                '♥': t('fortune.heart'),
                '♦': t('fortune.diamond'),
                '♣': t('fortune.club')
            };
            return bySuit[suit] || t('fortune.fallback');
        }

        function cardId(rank, suit) {
            return `${rank}${suit}`;
        }

        function buildTutorialDeck() {
            const fixedBottom = createCard('3', '♣');
            // Sequence is designed for tutorial flow:
            // opening deals 11 cards -> columns become [3,3,3,2],
            // then first manual DEAL draws the 12th card to column 4 and forms 9.
            const openingPlan = [
                createCard('2', '♠'),   // col1 #1
                createCard('10', '♦'),  // col2 #1
                createCard('5', '♣'),   // col3 #1
                createCard('A', '♠'),   // col4 #1
                createCard('8', '♥'),   // col1 #2
                createCard('4', '♣'),   // col2 #2
                createCard('6', '♠'),   // col3 #2
                createCard('A', '♦'),   // col4 #2
                createCard('7', '♦'),   // col1 #3
                createCard('2', '♥'),   // col2 #3
                createCard('4', '♠'),   // col3 #3
                createCard('7', '♣')    // first manual DEAL -> col4 #3 => 1+1+7=9
            ];

            const used = new Set(openingPlan.map((c) => cardId(c.rank, c.suit)));
            used.add(cardId(fixedBottom.rank, fixedBottom.suit));

            const remaining = [];
            suits.forEach((s) => ranks.forEach((r) => {
                const id = cardId(r, s);
                if (used.has(id)) return;
                remaining.push(createCard(r, s));
            }));
            // Tutorial deck uses a fixed seed so every tutorial run is reproducible.
            shuffleWithRng(remaining, mulberry32(TUTORIAL_FIXED_SEED));

            const topDeck = [...remaining, ...openingPlan.slice().reverse()];
            return [fixedBottom, ...topDeck];
        }

        function seedOpeningCards(cardsPerColumn = 3) {
            for (let round = 0; round < cardsPerColumn; round++) {
                for (let i = 0; i < slots.length; i++) {
                    if (deck.length === 0) return;
                    slots[i].cards.push(deck.pop());
                }
            }
        }

        function runOpeningDealAnimation(cardsPerColumn = 3, queueOverride = null, epoch = _gameEpoch) {
            const queue = Array.isArray(queueOverride) && queueOverride.length > 0
                ? [...queueOverride]
                : (() => {
                    const autoQueue = [];
                    for (let round = 0; round < cardsPerColumn; round++) {
                        for (let i = 0; i < slots.length; i++) {
                            autoQueue.push(slots[i].id);
                        }
                    }
                    return autoQueue;
                })();

            isBusy = true;
            selected = [];
            render();

            return new Promise((resolve) => {
                const step = (index) => {
                    if (epoch !== _gameEpoch) { isBusy = false; resolve(); return; }
                    if (index >= queue.length || deck.length === 0) {
                        isBusy = false;
                        resolve();
                        return;
                    }

                    const slotId = queue[index];
                    const slot = slots.find((s) => s.id === slotId);
                    if (!slot || !slot.active) {
                        step(index + 1);
                        return;
                    }

                    const card = deck.pop();
                    const deckRect = document.getElementById('deck-pile').getBoundingClientRect();
                    const colEl = document.getElementById(`col-${slotId}`);
                    const colRect = colEl.getBoundingClientRect();
                    const targetTop = getDealTargetTop(colEl, slot.cards.length);
                    const fly = createFly(card, deckRect);
                    const flyDuration = getDelay(360);
                    fly.style.willChange = 'transform';
                    fly.style.transform = 'translate(0, 0)';

                    playSound('deal');
                    const deltaX = colRect.left - deckRect.left;
                    const deltaY = targetTop - deckRect.top;
                    const midX = deltaX / 2;
                    const midY = deltaY / 2 - 30;
                    const motion = fly.animate(
                        [
                            { transform: 'translate(0, 0)' },
                            { transform: `translate(${midX}px, ${midY}px)`, offset: 0.45 },
                            { transform: `translate(${deltaX}px, ${deltaY}px)` }
                        ],
                        {
                            duration: flyDuration,
                            easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
                            fill: 'forwards'
                        }
                    );

                    motion.onfinish = () => {
                        if (epoch !== _gameEpoch) { fly.remove(); resolve(); return; }
                        slot.cards.push(card);
                        fly.remove();
                        render();
                        ParticleSystem.emit('dust', colRect.left + colRect.width / 2, targetTop + 10);
                        dealRhythmHaptic(); // 發牌節奏震動
                        // 落牌彈跳動畫
                        const col = document.getElementById(`col-${slotId}`);
                        if (col) {
                            const lastCard = col.querySelector('.card:last-child');
                            if (lastCard) {
                                lastCard.style.animation = `card-deal-land calc(0.22s * var(--anim-scale)) ease-out`;
                                setTimeout(() => { if (lastCard) lastCard.style.animation = ''; }, getDelay(220));
                            }
                        }
                        setTimeout(() => step(index + 1), getDelay(85));
                    };
                };

                step(0);
            });
        }

        function getAnimScale() {
            if (settings.animationSpeed === 'slow') return 1.35;
            if (settings.animationSpeed === 'fast') return 0.75;
            return 1;
        }

        function getDelay(ms) {
            return Math.max(40, Math.round(ms * getAnimScale()));
        }

        function shouldMinimizeMotion() {
            return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) || settings.animationSpeed === 'fast';
        }

        // ═══════════════════════════════════════════════════════
        // NATIVE SOUL — 六大靈魂元素
        // ═══════════════════════════════════════════════════════

        // --- 1. 深夜星空 ---
        (function initNightSky() {
            const h = new Date().getHours();
            if (h >= 21 || h < 6) document.body.classList.add('night-sky');
        })();

        // --- 2. 開局靈牌儀式 ---
        const SUIT_SYMBOLS = { '♠': '♠', '♥': '♥', '♦': '♦', '♣': '♣' };
        const SUIT_COLORS  = { '♠': '#e8e8ff', '♥': '#ff4444', '♦': '#ff4444', '♣': '#88ffbb' };

        function showOmenCard(guardianSuit) {
            return new Promise((resolve) => {
                const suit = guardianSuit || '★';
                const color = SUIT_COLORS[suit] || '#ffd700';
                const wrap = document.createElement('div');
                wrap.className = 'omen-card-wrap';
                wrap.innerHTML = `
                    <div class="omen-scene">
                        <div class="omen-inner">
                            <div class="omen-face omen-back"></div>
                            <div class="omen-face omen-front">
                                <span class="omen-label">Lucky</span>
                                <span class="omen-suit-char" style="color:${color}">${suit}</span>
                                <span class="omen-label">Guide</span>
                            </div>
                        </div>
                    </div>`;
                document.body.appendChild(wrap);

                // 翻牌後短暫展示，然後淡出
                setTimeout(() => {
                    wrap.classList.add('omen-wrap-out');
                    setTimeout(() => { wrap.remove(); resolve(); }, 450);
                }, getDelay(1700));
            });
        }

        // --- 3. 連擊靈獸浮現 ---
        const SPIRIT_BEASTS = {
            3: { cls: 'tier-3', icon: 'comboicon/tier3.png' },
            4: { cls: 'tier-4', icon: 'comboicon/tier4.png' },
            5: { cls: 'tier-5', icon: 'comboicon/tier5.png' },
        };
        Object.values(SPIRIT_BEASTS).forEach((meta) => {
            const preload = new Image();
            preload.src = meta.icon;
        });

        function showSpiritBeast(tier) {
            const meta = SPIRIT_BEASTS[tier];
            if (!meta) return;
            const el = document.createElement('div');
            el.className = `spirit-beast ${meta.cls}`;
            const discardEl = document.getElementById('discard-pile');
            if (discardEl) {
                const rect = discardEl.getBoundingClientRect();
                const iconSize = Math.max(64, Math.min(84, window.innerWidth * 0.15));
                const anchorX = rect.left + rect.width / 2;
                const anchorY = Math.max(iconSize * 0.55 + 8, rect.top - Math.max(18, iconSize * 0.34));
                el.style.left = `${Math.round(anchorX)}px`;
                el.style.top = `${Math.round(anchorY)}px`;
            }
            el.innerHTML = `
                <div class="spirit-beast-core">
                    <img class="spirit-beast-icon" src="${meta.icon}" alt="" />
                </div>`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), getDelay(1120));
        }

        // --- 4. 選牌光圈脈衝 ---
        function pulseCardSelect(cardEl) {
            if (!cardEl) return;
            cardEl.classList.remove('select-pulse');
            void cardEl.offsetWidth; // force reflow
            cardEl.classList.add('select-pulse');
            cardEl.addEventListener('animationend', () => cardEl.classList.remove('select-pulse'), { once: true });
        }

        // --- 5. 發牌節奏震動 (native only) ---
        let _dealHapticCount = 0;
        function dealRhythmHaptic() {
            if (!window.Capacitor?.isNativePlatform?.()) return;
            _dealHapticCount++;
            // 每 3 張一組輕觸，讓節奏感像洗牌
            const intensity = _dealHapticCount % 3 === 0 ? 18 : 10;
            triggerHaptic(intensity);
        }
        function resetDealHapticCount() { _dealHapticCount = 0; }

        // --- 6. 勝利震動儀式 (native only) ---
        async function winHapticCeremony(isZeroClear) {
            if (!window.Capacitor?.isNativePlatform?.()) return;
            if (isZeroClear) {
                // Void clear：長鳴，像鐘聲
                await triggerHaptic([200, 80, 200, 80, 400]);
            } else {
                // Lucky 3：三連脈衝，節奏感強
                await triggerHaptic([80, 40, 80, 40, 80, 40, 200]);
            }
        }
        // ═══════════════════════════════════════════════════════

        function syncBoardScale() {
            const board = document.getElementById('board');
            if (!board) return;

            const style = getComputedStyle(board);
            const gap = parseFloat(style.columnGap || style.gap) || 8;
            const usable = Math.max(260, board.clientWidth - gap * 3);
            const viewportW = window.innerWidth || 360;
            const viewportH = window.innerHeight || 640;
            // Sidebar mode: wide compact-landscape phone (S Ultra etc.) where footer
            // is position:fixed on the right — lower landscape threshold to 380px
            const isSidebarMode = viewportW > viewportH && viewportH < 500 && viewportW >= 640;
            const isLandscape = viewportW > viewportH && viewportH >= 380;

            const minCard = viewportW >= 1200 ? 108 : viewportW >= 900 ? 92 : 60;
            const maxCard = viewportW >= 1200 ? 154 : viewportW >= 900 ? 132 : 96;
            let cardW = Math.min(maxCard, Math.max(minCard, Math.floor(usable / 4)));

            // Sidebar uses tighter overlap (78% hidden vs 72%) so cards can be
            // larger while still fitting 10-deep stacks in limited height
            const overlapFactor = isSidebarMode ? 0.78 : 0.72;

            // In landscape, constrain card size by available height
            // so tall stacks (10+ cards) don't overflow
            if (isLandscape) {
                const headerH = document.getElementById('header')?.offsetHeight || 60;
                let boardH;
                if (board.clientHeight > 100) {
                    boardH = board.clientHeight - 20;
                } else {
                    const footerH = document.getElementById('footer')?.offsetHeight || 90;
                    boardH = viewportH - headerH - footerH - 30;
                }
                // visibleRatio = fraction of each peeking card that shows above the next
                const visibleRatio = 1 - overlapFactor;
                // A 30-deal scenario can produce 11-card stacks in 4 columns.
                // Reserve height for 11 cards to prevent landscape overflow.
                const maxStackCards = 11;
                const maxCardByHeight = Math.floor(boardH / (1 + (maxStackCards - 1) * visibleRatio) / 1.42);
                if (isSidebarMode) {
                    // Height is the absolute constraint — never let minCard override it
                    cardW = Math.min(cardW, maxCardByHeight);
                    cardW = Math.max(cardW, 48); // absolute readability floor
                } else {
                    cardW = Math.min(cardW, Math.max(minCard, maxCardByHeight));
                }
            }

            const cardH = Math.round(cardW * 1.42);
            const overlap = -Math.round(cardH * overlapFactor);

            document.documentElement.style.setProperty('--card-w', `${cardW}px`);
            document.documentElement.style.setProperty('--card-h', `${cardH}px`);
            document.documentElement.style.setProperty('--max-w', `${cardW}px`);
            document.documentElement.style.setProperty('--max-h', `${cardH}px`);
            document.documentElement.style.setProperty('--fixed-gap', `${overlap}px`);
        }

        function loadSettings() {
            try {
                const raw = localStorage.getItem(SETTINGS_KEY);
                if (!raw) return { ...DEFAULT_SETTINGS };
                const parsed = JSON.parse(raw);
                return {
                    sound: parsed.sound !== false,
                    vibration: parsed.vibration !== false,
                    animationSpeed: ['slow', 'normal', 'fast'].includes(parsed.animationSpeed) ? parsed.animationSpeed : 'normal',
                    locale: normalizeLocale(parsed.locale || detectInitialLocale()),
                    highContrast: Boolean(parsed.highContrast),
                    miiPeek: parsed.miiPeek !== false,
                    recycleAnim: parsed.recycleAnim !== false,
                    bgm: Boolean(parsed.bgm),
                    sumHelper: Boolean(parsed.sumHelper),
                    dailyNotif: Boolean(parsed.dailyNotif),
                    cardRankScale: normalizeCardScale(parsed.cardRankScale ?? parsed.cardFaceScale),
                    cardSuitScale: normalizeCardScale(parsed.cardSuitScale ?? parsed.cardFaceScale)
                };
            } catch (_) {
                return { ...DEFAULT_SETTINGS };
            }
        }

        function loadDeveloperMode() {
            try {
                return localStorage.getItem(DEV_MODE_KEY) === '1';
            } catch (_) {
                return false;
            }
        }

        function loadSeedCheatMode() {
            try {
                return localStorage.getItem(SEED_CHEAT_MODE_KEY) === '1';
            } catch (_) {
                return false;
            }
        }

        function saveDeveloperMode() {
            try {
                localStorage.setItem(DEV_MODE_KEY, developerMode ? '1' : '0');
            } catch (_) { }
        }

        function saveSeedCheatMode() {
            try {
                localStorage.setItem(SEED_CHEAT_MODE_KEY, seedCheatMode ? '1' : '0');
            } catch (_) { }
        }

        function saveSettings() {
            try {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            } catch (_) { }
        }

        function applySettings() {
            document.documentElement.style.setProperty('--anim-scale', String(getAnimScale()));
            document.body.classList.toggle('high-contrast', settings.highContrast);

            const soundEl = document.getElementById('setting-sound');
            const vibrationEl = document.getElementById('setting-vibration');
            const speedEl = document.getElementById('setting-animation-speed');
            const cardRankScaleEl = document.getElementById('setting-card-rank-scale');
            const cardRankScaleValueEl = document.getElementById('setting-card-rank-scale-value');
            const cardSuitScaleEl = document.getElementById('setting-card-suit-scale');
            const cardSuitScaleValueEl = document.getElementById('setting-card-suit-scale-value');
            const languageEl = document.getElementById('setting-language');
            const contrastEl = document.getElementById('setting-high-contrast');
            const miiPeekEl = document.getElementById('setting-mii-peek');
            const recycleAnimEl = document.getElementById('setting-recycle-anim');
            const versionEl = document.getElementById('setting-version');
            if (soundEl) soundEl.checked = settings.sound;
            const bgmEl = document.getElementById('setting-bgm');
            if (bgmEl) bgmEl.checked = !!settings.bgm;
            BGM.sync(!!settings.bgm);
            if (vibrationEl) vibrationEl.checked = settings.vibration;
            if (speedEl) speedEl.value = settings.animationSpeed;
            const rankScale = normalizeCardScale(settings.cardRankScale);
            const suitScale = normalizeCardScale(settings.cardSuitScale);
            document.documentElement.style.setProperty('--card-rank-scale', String(rankScale));
            document.documentElement.style.setProperty('--card-suit-scale', String(suitScale));
            if (cardRankScaleEl) cardRankScaleEl.value = String(cardScalePercent(rankScale));
            if (cardRankScaleValueEl) cardRankScaleValueEl.textContent = `${cardScalePercent(rankScale)}%`;
            if (cardSuitScaleEl) cardSuitScaleEl.value = String(cardScalePercent(suitScale));
            if (cardSuitScaleValueEl) cardSuitScaleValueEl.textContent = `${cardScalePercent(suitScale)}%`;
            if (languageEl) languageEl.value = settings.locale || currentLocale;
            if (contrastEl) contrastEl.checked = settings.highContrast;
            if (miiPeekEl) miiPeekEl.checked = settings.miiPeek;
            if (recycleAnimEl) recycleAnimEl.checked = settings.recycleAnim;
            const sumHelperEl = document.getElementById('setting-sum-helper');
            if (sumHelperEl) sumHelperEl.checked = !!settings.sumHelper;
            const dailyNotifEl = document.getElementById('setting-daily-notif');
            if (dailyNotifEl) dailyNotifEl.checked = !!settings.dailyNotif;
            if (versionEl) versionEl.innerText = `v${APP_VERSION}`;
            const aboutVerEl = document.getElementById('about-version-row');
            if (aboutVerEl) aboutVerEl.textContent = `v${APP_VERSION}`;
            const savedName = localStorage.getItem('lucky3-player-name') || '';
            const nameInput = document.getElementById('setting-player-name');
            if (nameInput) nameInput.value = savedName;
        }

        function updateSetting(key, value) {
            if (key === 'cardRankScale' || key === 'cardSuitScale') value = normalizeCardScale(value);
            settings[key] = value;
            applySettings();
            saveSettings();
        }

        function switchSettingsTab(idx) {
            document.querySelectorAll('.settings-tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
            document.querySelectorAll('.settings-tab-pane').forEach((p, i) => p.classList.toggle('active', i === idx));
            if (idx === 4) renderCardBackGrid();
        }

        function toggleSettings(show) {
            const overlay = document.getElementById('settings-overlay');
            if (!overlay) return;
            overlay.classList.toggle('show', show);
            if (show) switchSettingsTab(1);
        }

        function updateHeaderModeTag() {
            const tag = document.getElementById('header-mode-tag');
            if (!tag) return;
            const seedText = Number.isInteger(currentSeed) ? `Seed:${currentSeed}` : '';
            if (gameMode === 'daily') {
                const dailyText = t('header.daily_tag', { date: toLocalDateKey() });
                const parts = [dailyText, currentDifficultyTag, seedText].filter(Boolean);
                tag.innerText = parts.join(' · ');
                tag.classList.add('show');
            } else {
                const parts = [currentDifficultyTag, seedText].filter(Boolean);
                if (parts.length > 0) {
                    tag.innerText = parts.join(' · ');
                    tag.classList.add('show');
                } else {
                    tag.innerText = '';
                    tag.classList.remove('show');
                }
            }
            updateUndoCountDisplay();
        }

        function onSettingsOverlayClick(event) {
            if (event.target && event.target.id === 'settings-overlay') {
                toggleSettings(false);
            }
        }

        // ── Gallery System ─────────────────────────────────────────────────────
        const GALLERY_KEY = 'lucky3-gallery-v2';
        const DAILY_WINS_KEY = 'lucky3-daily-wins-v2';
        const PLAYER_FIRST_SEEN_KEY = 'lucky3-player-first-seen-v1';
        const FRAGMENT_EXCHANGE_COST = 5;
        const DROP_PITY_LIMIT = 2;
        const ENABLE_SECOND_WIN_GUARANTEE = true;
        const ENABLE_NEW_PLAYER_UNIQUE_PROTECTION = true;
        const NEW_PLAYER_PROTECTION_DAYS = 7;

        const PAINTINGS = [
            { id: '001', cols: 4, rows: 3 },
            { id: '002', cols: 4, rows: 3 },
            { id: '003', cols: 4, rows: 3 },
            { id: '004', cols: 3, rows: 4 },
            { id: '005', cols: 4, rows: 3 },
            { id: '006', cols: 3, rows: 4 },
            { id: '007', cols: 3, rows: 4 },
            { id: '008', cols: 4, rows: 3 },
            { id: '009', cols: 3, rows: 4 },
            { id: '010', cols: 4, rows: 3 },
            { id: '011', cols: 4, rows: 3 },
            { id: '012', cols: 3, rows: 4 },
        ];
        const DEFAULT_GALLERY_SERIES = [
            { id: 'early', name: { zh: '初光展廳', en: 'Early Light Hall' }, order: 1, paintingIds: ['001', '002', '003', '004'] },
            { id: 'nature', name: { zh: '自然展廳', en: 'Nature Hall' }, order: 2, paintingIds: ['005', '006', '007', '008'] },
            { id: 'modern', name: { zh: '現代展廳', en: 'Modern Hall' }, order: 3, paintingIds: ['009', '010', '011', '012'] },
            { id: 'archive', name: { zh: '典藏展廳', en: 'Archive Hall' }, order: 99, paintingIds: [] },
        ];

        let paintingBasePathCache = (location.pathname && location.pathname.includes('/app/')) ? 'paintings' : 'app/paintings';
        let currentGalleryMeta = null;
        let currentGalleryData = null;
        let currentGalleryNavIds = [];
        const galleryUiState = { lastUnlocked: null, frameRevealPaintingId: null };
        const paintingMetaCache = new Map();
        let galleryManifestCache = null;

        function emptyGalleryState() {
            return {
                version: 2,
                dust: 0,
                pityNoDrop: 0,
                focusPaintingId: PAINTINGS[0]?.id || '001',
                paintings: {},
            };
        }

        function normalizeGalleryState(raw) {
            const next = emptyGalleryState();
            if (!raw || typeof raw !== 'object') return next;

            if (raw.version === 2 && raw.paintings && typeof raw.paintings === 'object') {
                next.dust = Math.max(0, Number(raw.dust) || 0);
                next.pityNoDrop = Math.max(0, Number(raw.pityNoDrop) || 0);
                next.focusPaintingId = typeof raw.focusPaintingId === 'string' ? raw.focusPaintingId : next.focusPaintingId;
                for (const p of PAINTINGS) {
                    const src = raw.paintings[p.id];
                    const cols = p.cols;
                    const rows = p.rows;
                    const total = cols * rows;
                    const valid = Array.isArray(src?.collected)
                        ? src.collected.filter((x) => Number.isInteger(x) && x >= 0 && x < total)
                        : [];
                    next.paintings[p.id] = {
                        collected: [...new Set(valid)],
                        completedAt: Number(src?.completedAt) || null,
                    };
                }
                return next;
            }

            // v1 migration: { "001": { collected: [...] }, ... }
            for (const p of PAINTINGS) {
                const src = raw[p.id];
                const total = p.cols * p.rows;
                const valid = Array.isArray(src?.collected)
                    ? src.collected.filter((x) => Number.isInteger(x) && x >= 0 && x < total)
                    : [];
                next.paintings[p.id] = {
                    collected: [...new Set(valid)],
                    completedAt: Number(src?.completedAt) || null,
                };
            }
            return next;
        }

        function loadGalleryState() {
            try {
                const raw = localStorage.getItem(GALLERY_KEY);
                if (!raw) return emptyGalleryState();
                return normalizeGalleryState(JSON.parse(raw));
            } catch (_) {
                return emptyGalleryState();
            }
        }

        function saveGalleryState(state) {
            try {
                localStorage.setItem(GALLERY_KEY, JSON.stringify(normalizeGalleryState(state)));
            } catch (_) { }
        }

        function loadDailyWins() {
            try {
                const raw = localStorage.getItem(DAILY_WINS_KEY);
                if (!raw) return { date: '', count: 0 };
                const parsed = JSON.parse(raw);
                return {
                    date: typeof parsed.date === 'string' ? parsed.date : '',
                    count: Number.isInteger(parsed.count) && parsed.count >= 0 ? parsed.count : 0,
                };
            } catch (_) {
                return { date: '', count: 0 };
            }
        }

        function recordDailyWin() {
            const today = toLocalDateKey();
            const dw = loadDailyWins();
            if (dw.date !== today) dw.count = 0;
            dw.date = today;
            dw.count += 1;
            try { localStorage.setItem(DAILY_WINS_KEY, JSON.stringify(dw)); } catch (_) { }
            return dw.count;
        }

        function getPlayerAgeDays() {
            const today = toLocalDateKey();
            let firstSeen = '';
            try { firstSeen = String(localStorage.getItem(PLAYER_FIRST_SEEN_KEY) || ''); } catch (_) { }
            if (!firstSeen) {
                firstSeen = today;
                try { localStorage.setItem(PLAYER_FIRST_SEEN_KEY, firstSeen); } catch (_) { }
            }
            const ms = new Date(`${today}T00:00:00`).getTime() - new Date(`${firstSeen}T00:00:00`).getTime();
            if (!Number.isFinite(ms)) return 1;
            return Math.max(1, Math.floor(ms / 86400000) + 1);
        }

        async function resolvePaintingBasePath() {
            const candidates = [paintingBasePathCache, 'paintings', 'app/paintings'];
            for (const base of candidates) {
                try {
                    const probe = `${base}/${PAINTINGS[0].id}/meta.json`;
                    const res = await fetch(probe, { cache: 'no-store' });
                    if (res.ok) {
                        paintingBasePathCache = base;
                        return paintingBasePathCache;
                    }
                } catch (_) { }
            }
            return paintingBasePathCache;
        }

        function paintingCoverSrc(id) {
            return `${paintingBasePathCache}/${id}/cover.jpg`;
        }

        function paintingMetaSrc(id) {
            return `${paintingBasePathCache}/${id}/meta.json`;
        }
        function galleryManifestSrc() {
            return `${paintingBasePathCache}/gallery_manifest.json`;
        }

        async function loadGalleryManifest() {
            if (galleryManifestCache) return galleryManifestCache;
            try {
                const res = await fetch(galleryManifestSrc(), { cache: 'no-store' });
                if (!res.ok) return null;
                const json = await res.json();
                galleryManifestCache = json && typeof json === 'object' ? json : null;
                return galleryManifestCache;
            } catch (_) {
                return null;
            }
        }

        function paintingPieceSrc(id, row, col) {
            return `${paintingBasePathCache}/${id}/pieces/r${row}c${col}.jpg`;
        }

        async function loadPaintingMeta(id) {
            if (paintingMetaCache.has(id)) return paintingMetaCache.get(id);
            try {
                const res = await fetch(paintingMetaSrc(id), { cache: 'no-store' });
                if (!res.ok) return null;
                const meta = await res.json();
                paintingMetaCache.set(id, meta);
                return meta;
            } catch (_) {
                return null;
            }
        }

        function getDiscoveredPaintingIds(state) {
            return PAINTINGS
                .filter((p) => getCollectedSet(state, p.id).size > 0 || !!getPaintingEntry(state, p.id).completedAt)
                .map((p) => p.id);
        }

        function getSeriesLabel(seriesId) {
            const locale = currentLocale || 'en';
            const defs = getActiveSeriesDefs();
            const s = defs.find((x) => x.id === seriesId);
            if (!s) return seriesId;
            return locale.startsWith('zh') ? (s.name.zh || s.name.en || seriesId) : (s.name.en || s.name.zh || seriesId);
        }

        function getActiveSeriesDefs() {
            if (Array.isArray(galleryManifestCache?.series) && galleryManifestCache.series.length > 0) {
                return galleryManifestCache.series;
            }
            return DEFAULT_GALLERY_SERIES;
        }

        function resolvePaintingSeriesId(meta, paintingId) {
            if (meta && typeof meta.series === 'string' && meta.series.trim()) return meta.series.trim();
            const manifestHit = Array.isArray(galleryManifestCache?.paintings)
                ? galleryManifestCache.paintings.find((p) => p && p.id === paintingId && typeof p.series === 'string' && p.series.trim())
                : null;
            if (manifestHit) return manifestHit.series.trim();
            const hit = DEFAULT_GALLERY_SERIES.find((s) => Array.isArray(s.paintingIds) && s.paintingIds.includes(paintingId));
            return hit ? hit.id : 'archive';
        }

        function getPaintingEntry(state, paintingId) {
            if (!state.paintings[paintingId]) {
                state.paintings[paintingId] = { collected: [], completedAt: null };
            }
            return state.paintings[paintingId];
        }

        function getCollectedSet(state, paintingId) {
            return new Set(getPaintingEntry(state, paintingId).collected || []);
        }

        function allPieces() {
            const out = [];
            for (const p of PAINTINGS) {
                const total = p.cols * p.rows;
                for (let idx = 0; idx < total; idx++) out.push({ id: p.id, idx, cols: p.cols, rows: p.rows });
            }
            return out;
        }

        function uncollectedPieces(state) {
            return allPieces().filter((piece) => !getCollectedSet(state, piece.id).has(piece.idx));
        }

        function pickRandom(arr) {
            if (!arr || arr.length === 0) return null;
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function computeDropSpec(winCount, pityNoDrop) {
            if (winCount <= 1) {
                return { canDrop: false, guaranteed: false, rate: 0 };
            }
            let rate = 0.7;
            if (winCount === 2) rate = ENABLE_SECOND_WIN_GUARANTEE ? 1 : 0.7;
            else if (winCount === 3) rate = 0.9;
            else rate = 1;
            const guaranteed = pityNoDrop >= DROP_PITY_LIMIT;
            return { canDrop: true, guaranteed, rate };
        }

        function refreshFocusPainting(state) {
            const incomplete = [];
            for (const p of PAINTINGS) {
                const total = p.cols * p.rows;
                const count = getCollectedSet(state, p.id).size;
                if (count < total) incomplete.push({ id: p.id, ratio: count / total });
            }
            if (incomplete.length === 0) {
                state.focusPaintingId = PAINTINGS[0]?.id || '001';
                return;
            }
            incomplete.sort((a, b) => b.ratio - a.ratio);
            state.focusPaintingId = incomplete[0].id;
        }

        function pickDropCandidate(state) {
            const all = allPieces();
            if (all.length === 0) return null;
            const uncollected = uncollectedPieces(state);

            if (uncollected.length === 0) return pickRandom(all);

            const focusId = state.focusPaintingId;
            const focusAll = all.filter((x) => x.id === focusId);
            const focusUncollected = uncollected.filter((x) => x.id === focusId);

            // 80% 優先給未收集碎片；20% 可能重複（重複轉星塵）
            const preferUncollected = Math.random() < 0.8;
            if (focusAll.length > 0 && Math.random() < 0.45) {
                const focusPool = preferUncollected && focusUncollected.length > 0 ? focusUncollected : focusAll;
                return pickRandom(focusPool);
            }
            return pickRandom(preferUncollected ? uncollected : all);
        }

        function applyDropToState(state, piece) {
            const entry = getPaintingEntry(state, piece.id);
            const collected = new Set(entry.collected || []);
            if (collected.has(piece.idx)) {
                state.dust = Math.max(0, (Number(state.dust) || 0) + 1);
                return { type: 'dust', dustGain: 1, piece };
            }
            const wasComplete = !!entry.completedAt;
            collected.add(piece.idx);
            entry.collected = [...collected];
            const total = piece.cols * piece.rows;
            if (entry.collected.length >= total && !entry.completedAt) {
                entry.completedAt = Date.now();
            }
            if (!wasComplete && !!entry.completedAt) {
                galleryUiState.frameRevealPaintingId = piece.id;
            }
            galleryUiState.lastUnlocked = `${piece.id}:${piece.idx}`;
            refreshFocusPainting(state);
            return { type: 'piece', dustGain: 0, piece };
        }

        function ensureGalleryDom() {
            if (!document.getElementById('gallery-overlay')) {
                const overlay = document.createElement('div');
                overlay.id = 'gallery-overlay';
                overlay.innerHTML = `
                    <div class="gallery-header">
                        <button type="button" class="gallery-back" onclick="closeGallery()">←</button>
                        <div class="gallery-header-title" data-i18n="gallery.title">Gallery</div>
                    </div>
                    <div id="gallery-stats" class="gallery-detail-footer"></div>
                    <div id="gallery-list" class="gallery-list"></div>
                `;
                document.body.appendChild(overlay);
            }
            if (!document.getElementById('gallery-detail-overlay')) {
                const detail = document.createElement('div');
                detail.id = 'gallery-detail-overlay';
                detail.innerHTML = `
                    <div class="gallery-header">
                        <button type="button" class="gallery-back" onclick="closeGalleryDetail()">←</button>
                        <div id="gallery-detail-title" class="gallery-header-title">Gallery</div>
                    </div>
                    <div id="gallery-detail-body" style="flex:1;display:flex;flex-direction:column;"></div>
                `;
                document.body.appendChild(detail);
            }
            applyI18nToDom();
        }

        function ensureGalleryEntryButtons() {
            const playPane = document.getElementById('stab-2');
            if (!playPane || document.getElementById('settings-gallery-btn')) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'settings-gallery-btn';
            btn.className = 'settings-achievement';
            btn.setAttribute('data-i18n', 'settings.gallery');
            btn.onclick = () => openGalleryFromSettings();
            btn.textContent = t('settings.gallery');
            const dailyBtn = playPane.querySelector('.settings-daily');
            if (dailyBtn && dailyBtn.parentNode) {
                dailyBtn.parentNode.insertBefore(btn, dailyBtn.nextSibling);
            } else {
                playPane.prepend(btn);
            }
            applyI18nToDom();
        }

        function openGalleryFromSettings() {
            toggleSettings(false);
            openGallery();
        }

        function showFragmentToast(result) {
            const piece = result?.piece;
            if (!piece) return;
            const row = Math.floor(piece.idx / piece.cols);
            const col = piece.idx % piece.cols;
            const src = paintingPieceSrc(piece.id, row, col);

            // 如果 focus-widget 是隱藏的，降級為簡單 toast
            const widget = document.getElementById('focus-widget');
            if (!widget || widget.style.display === 'none' || widget.offsetParent === null) {
                const title = result.type === 'piece' ? t('gallery.fragment_drop') : t('gallery.fragment_to_dust', { count: result.dustGain || 1 });
                const hint = result.type === 'piece' ? t('gallery.fragment_hint') : t('gallery.dust_hint');
                const toast = document.createElement('div');
                toast.className = 'fragment-toast';
                toast.innerHTML = `<div class="fragment-toast-thumb"><img src="${src}" alt=""></div><div class="fragment-toast-text"><strong>${title}</strong>${hint}</div>`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3100);
                return;
            }

            // 飛入動畫
            const fly = document.createElement('div');
            fly.className = 'fragment-fly';
            fly.innerHTML = `<img src="${src}" alt="">`;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            fly.style.cssText = `left:${cx - 40}px; top:${cy - 40}px;`;
            document.body.appendChild(fly);

            requestAnimationFrame(() => {
                fly.classList.add('appear');
                setTimeout(() => {
                    const wr = widget.getBoundingClientRect();
                    const tx = wr.left + wr.width / 2 - cx;
                    const ty = wr.top + wr.height / 2 - cy;
                    fly.style.transition = 'transform 0.5s cubic-bezier(0.4,0,1,1), opacity 0.5s ease';
                    fly.style.transform = `translate(${tx}px, ${ty}px) scale(0.3)`;
                    fly.style.opacity = '0';
                    setTimeout(() => {
                        fly.remove();
                        widget.classList.add('widget-pulse');
                        setTimeout(() => widget.classList.remove('widget-pulse'), 500);
                        // Haptics: light tap on landing
                        try {
                            const { Haptics, ImpactStyle } = window.Capacitor?.Plugins || {};
                            if (Haptics) Haptics.impact({ style: ImpactStyle.Light });
                        } catch (_) {}
                    }, 520);
                }, 700); // 0.3s appear + 0.4s pause
            });
        }

        function onWinDropFragment() {
            const winCount = recordDailyWin();
            const state = loadGalleryState();
            const spec = computeDropSpec(winCount, state.pityNoDrop || 0);

            if (!spec.canDrop) {
                state.pityNoDrop = 0;
                saveGalleryState(state);
                return;
            }

            const shouldDrop = spec.guaranteed || Math.random() < spec.rate;
            if (!shouldDrop) {
                state.pityNoDrop = Math.max(0, (state.pityNoDrop || 0) + 1);
                saveGalleryState(state);
                return;
            }

            const inNewPlayerWindow = ENABLE_NEW_PLAYER_UNIQUE_PROTECTION && getPlayerAgeDays() <= NEW_PLAYER_PROTECTION_DAYS;
            const shouldForceUniqueSecondWin = inNewPlayerWindow && winCount === 2;
            let candidate = null;
            if (shouldForceUniqueSecondWin) {
                const uncollected = uncollectedPieces(state);
                candidate = pickRandom(uncollected.length > 0 ? uncollected : allPieces());
            } else {
                candidate = pickDropCandidate(state);
            }
            if (!candidate) return;

            state.pityNoDrop = 0;
            const result = applyDropToState(state, candidate);
            saveGalleryState(state);
            showFragmentToast(result);
            updateFocusWidget();
            if (galleryUiState.frameRevealPaintingId) {
                const revealId = galleryUiState.frameRevealPaintingId;
                galleryUiState.frameRevealPaintingId = null;
                setTimeout(() => showPaintingReveal(revealId), 1500);
            }
        }

        async function updateFocusWidget() {
            const el = document.getElementById('focus-widget');
            if (!el) return;
            const state = loadGalleryState();
            const focusId = state.focusPaintingId;
            const painting = PAINTINGS.find(p => p.id === focusId);
            if (!painting) { el.style.display = 'none'; return; }
            const total = painting.cols * painting.rows;
            const collected = getCollectedSet(state, focusId).size;
            if (collected >= total) { el.style.display = 'none'; return; }
            await resolvePaintingBasePath();
            const pct = total > 0 ? Math.round(collected / total * 100) : 0;
            el.style.display = 'flex';
            el.innerHTML = `
                <img class="focus-widget-thumb" src="${paintingCoverSrc(focusId)}" alt="">
                <div class="focus-widget-info">
                    <div class="focus-widget-title" id="focus-widget-title">...</div>
                    <div class="focus-widget-bar-wrap">
                        <div class="focus-widget-bar-fill" style="width:${pct}%"></div>
                    </div>
                </div>
                <div class="focus-widget-count">${collected}/${total}</div>`;
            fetch(paintingMetaSrc(focusId))
                .then(r => r.json())
                .then(meta => {
                    const titleEl = document.getElementById('focus-widget-title');
                    if (!titleEl) return;
                    const isZH = (currentLocale || '').startsWith('zh');
                    titleEl.textContent = isZH ? (meta.title || meta.titleEn || focusId) : (meta.titleEn || meta.title || focusId);
                })
                .catch(() => {});
        }

        async function showPaintingReveal(paintingId) {
            const meta = PAINTINGS.find(p => p.id === paintingId);
            if (!meta) return;
            const state = loadGalleryState();
            const completedCount = Object.values(state.paintings || {}).filter(e => e.completedAt).length;
            await resolvePaintingBasePath();

            // Haptics: heavy + notification on painting completion
            try {
                const { Haptics, ImpactStyle, NotificationType } = window.Capacitor?.Plugins || {};
                if (Haptics) {
                    await Haptics.impact({ style: ImpactStyle.Heavy });
                    setTimeout(async () => {
                        try { await Haptics.notification({ type: NotificationType.Success }); } catch(_) {}
                    }, 600);
                }
            } catch (_) {}

            let title = meta.title || paintingId;
            try {
                const metaJson = await fetch(paintingMetaSrc(paintingId)).then(r => r.json());
                const locale = typeof currentLocale !== 'undefined' ? currentLocale : 'zh-Hant';
                title = (locale === 'en' || !metaJson.title) ? (metaJson.titleEn || metaJson.title) : metaJson.title;
            } catch (_) {}

            const overlay = document.createElement('div');
            overlay.id = 'painting-reveal-overlay';
            overlay.className = 'painting-reveal-overlay';
            overlay.innerHTML = `
                <div class="reveal-backdrop"></div>
                <div class="reveal-content">
                    <div class="reveal-frame">
                        <img src="${paintingCoverSrc(paintingId)}" alt="">
                    </div>
                    <div class="reveal-title">${title}</div>
                    <div class="reveal-badge">第 ${completedCount} 幅收藏完成</div>
                    <button type="button" class="reveal-continue-btn" onclick="document.getElementById('painting-reveal-overlay').remove()">繼續</button>
                </div>`;
            overlay.querySelector('.reveal-backdrop').onclick = () => overlay.remove();
            document.body.appendChild(overlay);

            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            setTimeout(() => {
                try {
                    ParticleSystem.emit('confetti', cx - 80, cy - 100, { count: 30 });
                    ParticleSystem.emit('confetti', cx + 80, cy - 100, { count: 30 });
                    ParticleSystem.emit('fireworks', cx, cy, { count: 20 });
                } catch (_) {}
            }, 200);
        }

        function updateStreakFlame() {
            const el = document.getElementById('streak-flame');
            if (!el) return;
            const ach = loadAchievements();
            const streak = ach.currentStreak || 0;
            if (streak < 1) { el.style.display = 'none'; return; }
            let cls = 'streak-flame';
            if (streak >= 7) cls += ' hot';
            else if (streak >= 3) cls += ' warm';
            else cls += ' cool';
            el.className = cls;
            el.style.display = 'flex';
            el.innerHTML = `<span class="flame-icon">🔥</span><span class="flame-count">${streak}</span>`;
        }

        function renderGalleryStats(state) {
            const statsEl = document.getElementById('gallery-stats');
            if (!statsEl) return;
            const pity = Number(state.pityNoDrop) || 0;
            const pityText = pity >= DROP_PITY_LIMIT ? t('gallery.pity_ready') : t('gallery.pity', { count: pity, total: DROP_PITY_LIMIT });
            const discovered = getDiscoveredPaintingIds(state).length;
            const total = PAINTINGS.length;
            statsEl.innerHTML = `
                <div class="gallery-progress-text" style="text-align:center">
                    ${t('gallery.dust')}: <strong style="color:#ffd700">${state.dust || 0}</strong>
                    &nbsp;&nbsp;·&nbsp;&nbsp;
                    ${pityText}
                    &nbsp;&nbsp;·&nbsp;&nbsp;
                    ${discovered}/${total}
                </div>`;
        }

        async function renderGalleryList() {
            ensureGalleryDom();
            await resolvePaintingBasePath();
            await loadGalleryManifest();
            const list = document.getElementById('gallery-list');
            if (!list) return;
            const state = loadGalleryState();
            renderGalleryStats(state);
            list.innerHTML = '';

            const discoveredIds = new Set(getDiscoveredPaintingIds(state));
            const featuredIds = PAINTINGS.map((p) => p.id).filter((id) => discoveredIds.has(id)).slice(0, 3);
            if (featuredIds.length > 0) {
                const hall = document.createElement('div');
                hall.className = 'gallery-hall-row';
                for (const id of featuredIds) {
                    const meta = await loadPaintingMeta(id);
                    if (!meta) continue;
                    const title = (currentLocale || 'en') === 'en' || !meta.title ? (meta.titleEn || meta.title || id) : meta.title;
                    const tile = document.createElement('button');
                    tile.type = 'button';
                    tile.className = 'gallery-hall-tile';
                    tile.innerHTML = `<img src="${paintingCoverSrc(id)}" alt="${title}"><span>${title}</span>`;
                    tile.addEventListener('click', async () => {
                        const freshMeta = await loadPaintingMeta(id);
                        if (!freshMeta) return;
                        openGalleryDetailById(id, freshMeta);
                    });
                    hall.appendChild(tile);
                }
                if (hall.childElementCount > 0) list.appendChild(hall);
            }

            const cards = [];
            for (const p of PAINTINGS) {
                const meta = await loadPaintingMeta(p.id);
                if (!meta) continue;
                const entry = getPaintingEntry(state, p.id);
                const collected = (entry.collected || []).length;
                const total = meta.totalPieces || (meta.cols * meta.rows);
                const pct = Math.round((collected / total) * 100);
                const isComplete = collected >= total;
                const isDiscovered = discoveredIds.has(p.id);
                const locale = currentLocale || 'en';
                const title = (locale === 'en' || !meta.title) ? (meta.titleEn || meta.title) : meta.title;
                const seriesId = resolvePaintingSeriesId(meta, p.id);
                cards.push({
                    id: p.id,
                    seriesId,
                    collected,
                    total,
                    pct,
                    isComplete,
                    isDiscovered,
                    title,
                    orientation: meta.orientation,
                });
            }

            currentGalleryNavIds = cards.filter((c) => c.isDiscovered).map((c) => c.id);
            const seriesMap = new Map();
            for (const s of getActiveSeriesDefs()) seriesMap.set(s.id, { ...s, cards: [] });
            for (const c of cards) {
                if (!seriesMap.has(c.seriesId)) {
                    seriesMap.set(c.seriesId, {
                        id: c.seriesId,
                        name: { zh: c.seriesId, en: c.seriesId },
                        order: 90,
                        paintingIds: [],
                        cards: [],
                    });
                }
                seriesMap.get(c.seriesId).cards.push(c);
            }
            const orderedSeries = [...seriesMap.values()]
                .filter((s) => s.cards.length > 0)
                .sort((a, b) => (a.order || 99) - (b.order || 99));

            for (const series of orderedSeries) {
                const discoveredCount = series.cards.filter((x) => x.isDiscovered).length;
                const completeCount = series.cards.filter((x) => x.isComplete).length;
                const section = document.createElement('div');
                section.className = 'gallery-series-section';
                section.innerHTML = `
                    <div class="gallery-series-header">
                        <div class="gallery-series-title">${getSeriesLabel(series.id)}</div>
                        <div class="gallery-series-stat">${completeCount}/${series.cards.length} · ${discoveredCount}/${series.cards.length}</div>
                    </div>
                `;
                const seriesList = document.createElement('div');
                seriesList.className = 'gallery-series-list';

                for (const c of series.cards) {
                    const card = document.createElement('div');
                    card.className = `gallery-card${c.isComplete ? ' completed' : ''}`;
                    const cardTitle = c.isDiscovered ? c.title : '???';
                    card.innerHTML = `
                    <div class="gallery-card-thumb ${c.orientation}">
                        ${c.isDiscovered ? `<img src="${paintingCoverSrc(c.id)}" alt="${c.title}">` : '<div class="gallery-card-thumb-mask">未揭幕</div>'}
                    </div>
                    <div class="gallery-card-info">
                        <div class="gallery-card-title">${cardTitle}</div>
                        <div class="gallery-progress-bar">
                            <div class="gallery-progress-fill" style="width:${c.pct}%"></div>
                        </div>
                        <div class="gallery-progress-text">${c.collected} / ${c.total} ${t('gallery.pieces')}</div>
                    </div>
                    <div class="gallery-card-lock">${c.isComplete ? '✦' : (c.isDiscovered ? '○' : '🔒')}</div>`;
                    if (c.isDiscovered) {
                        card.addEventListener('click', async () => {
                            const meta = await loadPaintingMeta(c.id);
                            if (!meta) return;
                            openGalleryDetailById(c.id, meta);
                        });
                    } else {
                        card.classList.add('locked');
                    }
                    seriesList.appendChild(card);
                }
                section.appendChild(seriesList);
                list.appendChild(section);
            }
        }

        function openGalleryDetailById(paintingId, preloadedMeta) {
            const state = loadGalleryState();
            const entry = getPaintingEntry(state, paintingId);
            if (!preloadedMeta) return;
            openGalleryDetail(preloadedMeta, entry);
        }

        function openGallery() {
            ensureGalleryDom();
            renderGalleryList();
            document.getElementById('gallery-overlay')?.classList.add('show');
        }

        function closeGallery() {
            document.getElementById('gallery-overlay')?.classList.remove('show');
        }

        function closeGalleryDetail() {
            document.getElementById('gallery-detail-overlay')?.classList.remove('show');
        }

        function exchangeOneFragment() {
            if (!currentGalleryMeta) return;
            const state = loadGalleryState();
            if ((state.dust || 0) < FRAGMENT_EXCHANGE_COST) return;
            const entry = getPaintingEntry(state, currentGalleryMeta.id);
            const collected = new Set(entry.collected || []);
            const total = currentGalleryMeta.cols * currentGalleryMeta.rows;
            const missing = [];
            for (let i = 0; i < total; i++) {
                if (!collected.has(i)) missing.push(i);
            }
            if (missing.length === 0) return;

            const idx = missing[Math.floor(Math.random() * missing.length)];
            state.dust -= FRAGMENT_EXCHANGE_COST;
            const wasComplete = !!entry.completedAt;
            collected.add(idx);
            entry.collected = [...collected];
            if (entry.collected.length >= total && !entry.completedAt) {
                entry.completedAt = Date.now();
            }
            const justCompleted = !wasComplete && !!entry.completedAt;
            if (justCompleted) {
                galleryUiState.frameRevealPaintingId = currentGalleryMeta.id;
            }
            galleryUiState.lastUnlocked = `${currentGalleryMeta.id}:${idx}`;
            refreshFocusPainting(state);
            saveGalleryState(state);
            currentGalleryData = entry;
            openGalleryDetail(currentGalleryMeta, currentGalleryData);
            renderGalleryList();
            // Stardust completion deserves the same reveal celebration as a natural drop.
            if (justCompleted) {
                setTimeout(() => showPaintingReveal(currentGalleryMeta.id), 600);
            }
        }

        function openGalleryDetail(meta, galleryData) {
            const overlay = document.getElementById('gallery-detail-overlay');
            const titleEl = document.getElementById('gallery-detail-title');
            const body = document.getElementById('gallery-detail-body');
            if (!overlay || !body) return;
            currentGalleryMeta = meta;
            currentGalleryData = galleryData;

            const locale = currentLocale || 'en';
            const title = (locale === 'en' || !meta.title) ? (meta.titleEn || meta.title) : meta.title;
            const navIdx = currentGalleryNavIds.indexOf(meta.id);
            const prevId = navIdx > 0 ? currentGalleryNavIds[navIdx - 1] : null;
            const nextId = navIdx >= 0 && navIdx < currentGalleryNavIds.length - 1 ? currentGalleryNavIds[navIdx + 1] : null;
            if (titleEl) {
                titleEl.innerHTML = `<span>${title}</span>
                <span class="gallery-detail-nav">
                    <button type="button" class="gallery-nav-btn" ${prevId ? '' : 'disabled'} onclick="openGalleryNeighbor(-1)">‹</button>
                    <button type="button" class="gallery-nav-btn" ${nextId ? '' : 'disabled'} onclick="openGalleryNeighbor(1)">›</button>
                </span>`;
            }

            const state = loadGalleryState();
            const collected = new Set(galleryData.collected || []);
            const total = meta.cols * meta.rows;
            const isComplete = collected.size >= total;
            const shouldPlayFrameReveal = isComplete && galleryUiState.frameRevealPaintingId === meta.id;

            body.innerHTML = '';

            if (isComplete) {
                body.innerHTML = `
                    <div class="gallery-full-wrap">
                        <div class="gallery-frame${meta.frameStyle ? ` frame-${meta.frameStyle}` : ''}${shouldPlayFrameReveal ? ' just-completed' : ''}">
                            <img src="${paintingCoverSrc(meta.id)}" alt="${title}">
                        </div>
                    </div>
                    <div class="gallery-detail-footer">
                        <div class="gallery-completed-label">${t('gallery.completed')}</div>
                        <div class="gallery-progress-text">${t('gallery.dust')}: <strong style="color:#ffd700">${state.dust || 0}</strong></div>
                    </div>`;
                if (shouldPlayFrameReveal) galleryUiState.frameRevealPaintingId = null;
            } else {
                const puzzle = document.createElement('div');
                puzzle.className = 'gallery-puzzle';
                const maxW = Math.min(window.innerWidth * 0.88, 420);
                const pieceW = Math.floor((maxW - (meta.cols - 1) * 2) / meta.cols);
                // Derive piece aspect from actual meta.pieceW/pieceH (slice_painting.py
                // writes the real dimensions). Fall back to orientation flag for legacy
                // metas that don't have pieceW/H.
                let aspect;
                if (Number.isFinite(meta.pieceW) && Number.isFinite(meta.pieceH) && meta.pieceW > 0) {
                    aspect = meta.pieceH / meta.pieceW;
                } else {
                    aspect = meta.orientation === 'portrait' ? 1.5 : meta.orientation === 'landscape' ? 0.67 : 1;
                }
                const pieceH = Math.floor(pieceW * aspect);
                puzzle.style.gridTemplateColumns = `repeat(${meta.cols}, ${pieceW}px)`;

                for (let r = 0; r < meta.rows; r++) {
                    for (let c = 0; c < meta.cols; c++) {
                        const idx = r * meta.cols + c;
                        const isUnlocked = collected.has(idx);
                        const piece = document.createElement('div');
                        const unlockTag = galleryUiState.lastUnlocked === `${meta.id}:${idx}` ? ' new-unlock' : '';
                        piece.className = `gallery-piece${isUnlocked ? unlockTag : ' locked'}`;
                        piece.style.width = `${pieceW}px`;
                        piece.style.height = `${pieceH}px`;
                        piece.innerHTML = `<img src="${paintingPieceSrc(meta.id, r, c)}" alt="">`;
                        puzzle.appendChild(piece);
                    }
                }
                const wrap = document.createElement('div');
                wrap.className = 'gallery-puzzle-wrap';
                wrap.appendChild(puzzle);
                body.appendChild(wrap);

                const canExchange = (state.dust || 0) >= FRAGMENT_EXCHANGE_COST;
                const footer = document.createElement('div');
                footer.className = 'gallery-detail-footer';
                footer.innerHTML = `
                    <div class="gallery-progress-text" style="text-align:center">${collected.size} / ${total} ${t('gallery.pieces')}</div>
                    <div class="gallery-progress-text" style="text-align:center;margin-top:6px;">${t('gallery.dust')}: <strong style="color:#ffd700">${state.dust || 0}</strong></div>
                    <button type="button" class="settings-secondary" onclick="exchangeOneFragment()" ${canExchange ? '' : 'disabled'} style="margin-top:10px;">
                        ${t('gallery.exchange_one')} (${FRAGMENT_EXCHANGE_COST})
                    </button>
                `;
                body.appendChild(footer);
            }
            overlay.classList.add('show');
        }

        async function openGalleryNeighbor(direction) {
            if (!currentGalleryMeta) return;
            const idx = currentGalleryNavIds.indexOf(currentGalleryMeta.id);
            if (idx < 0) return;
            const targetId = currentGalleryNavIds[idx + direction];
            if (!targetId) return;
            const meta = await loadPaintingMeta(targetId);
            if (!meta) return;
            const state = loadGalleryState();
            openGalleryDetail(meta, getPaintingEntry(state, targetId));
        }
        // ── End Gallery System ─────────────────────────────────────────────────

        // ── Card Back Collection ────────────────────────────────────────────────
        const CARD_BACK_KEY      = 'lucky3-card-back-v1';
        const CARD_BACK_UNLOCKED = 'lucky3-card-back-unlocked-v1';
        const DEFAULT_UNLOCKED_CARD_BACKS = ['classic', 'retro_gold'];
        const CARD_BACKS = [
            { id: 'classic',   nameEN: 'Classic Blue', nameZH: '經典藍',
              condEN: 'Default',               condZH: '預設解鎖',         cond: null },
            { id: 'retro_gold', nameEN: 'Retro Gold',  nameZH: '復古鎏金',
              condEN: 'Default style option', condZH: '預設樣式可選',      cond: null },
            { id: 'nightgold', nameEN: 'Night Gold',   nameZH: '夜金',
              condEN: 'Win 20 games',          condZH: '累積勝利 20 場', cond: 'wins20' },
            { id: 'forest',    nameEN: 'Deep Forest',  nameZH: '深林',
              condEN: 'Win 10 games',          condZH: '累積勝 10 局',     cond: 'wins10' },
            { id: 'crimson',   nameEN: 'Crimson',      nameZH: '赤焰',
              condEN: '7-day win streak',      condZH: '連續 7 天勝利',    cond: 'streak7' },
            { id: 'void',      nameEN: 'Void',         nameZH: '虛空',
              condEN: 'Win 1 game',            condZH: '完成 1 場勝利',     cond: 'void' },
            { id: 'lucky',     nameEN: 'Lucky',        nameZH: 'Lucky',
              condEN: 'Win 50 games',          condZH: '累積勝 50 局',     cond: 'wins50' },
            { id: 'combo5',    nameEN: 'Combo Nova',   nameZH: '連擊新星',
              condEN: 'Combo Expert (x5)',     condZH: '連擊高手（x5）',   cond: 'combo5' },
            { id: 'speed18',   nameEN: 'Speed Crest',  nameZH: '疾速徽印',
              condEN: 'Speed Runner (<=18)',   condZH: '快手玩家（18步內）', cond: 'speed18' },
            { id: 'ironwill',  nameEN: 'Iron Oath',    nameZH: '鋼鐵誓約',
              condEN: 'Iron Will (No Undo)',   condZH: '鐵血意志（無 Undo）', cond: 'ironwill' },
            { id: 'suitcollector', nameEN: 'Four Sigils', nameZH: '四象徽記',
              condEN: 'Suit Collector (4/4)',  condZH: '四色收集家（4/4）', cond: 'suitcollector' },
            { id: 'luckydraw', nameEN: 'Spade Destiny', nameZH: '黑桃天命',
              condEN: 'Lucky Draw (Final ♠3)', condZH: '幸運抽選（最後牌♠3）', cond: 'luckydraw' },
            { id: 'fullsweep', nameEN: 'Sweep Crown',  nameZH: '全掃王冠',
              condEN: 'Full Sweep (4 columns)', condZH: '全欄清除（4欄）', cond: 'fullsweep' },
            { id: 'dailyregular', nameEN: 'Daily Orbit', nameZH: '每日軌跡',
              condEN: 'Daily Regular (7 wins)', condZH: '每日常客（7 勝）', cond: 'dailyregular' },
            { id: 'chainreaction', nameEN: 'Chain Flux', nameZH: '連鎖脈衝',
              condEN: 'Chain Reaction (3+ combos)', condZH: '連鎖反應（同局 3+ combo）', cond: 'chainreaction' },
            // Extreme Challenge rewards
            { id: 'shilian',  nameEN: 'Trial',         nameZH: '試煉',
              condEN: 'Complete the Trial challenge',         condZH: '完成「試煉」挑戰', cond: 'challenge_shilian' },
            { id: 'tianzhu',  nameEN: 'Sky Pillar',    nameZH: '天柱',
              condEN: 'Complete the Sky Pillar challenge',    condZH: '完成「天柱」挑戰', cond: 'challenge_tianzhu' },
            { id: 'xingbao',  nameEN: 'Star Burst',    nameZH: '星爆',
              condEN: 'Complete the Star Burst challenge',    condZH: '完成「星爆」挑戰', cond: 'challenge_xingbao' },
            { id: 'lunhui',   nameEN: 'Reincarnation', nameZH: '輪迴',
              condEN: 'Complete the Reincarnation challenge', condZH: '完成「輪迴」挑戰', cond: 'challenge_lunhui' },
            { id: 'jufeng',   nameEN: 'Hurricane',     nameZH: '颶風',
              condEN: 'Complete the Hurricane challenge',     condZH: '完成「颶風」挑戰', cond: 'challenge_jufeng' },
            { id: 'yongheng', nameEN: 'Eternity',      nameZH: '永恆',
              condEN: 'Complete the Eternity challenge',      condZH: '完成「永恆」挑戰', cond: 'challenge_yongheng' },
        ];

        // ── Card Back Registry (single source for image/theme/mii fx) ─────────
        const MII_PROFILE_PRESETS = {
            CRYSTAL: {
                miiText: {
                    default: { color: '#FFFFFF', border: 'rgba(170,220,255,0.45)', bg: 'rgba(12, 25, 42, 0.9)' },
                    chance: { color: '#8efcff', border: 'rgba(120, 220, 255, 0.6)', bg: 'rgba(7, 32, 48, 0.94)' },
                },
                haptic: { peek: [20, 20, 25], chance: [20, 20, 60] },
            },
            FORGE: {
                miiText: {
                    default: { color: '#FFE7A3', border: 'rgba(255, 204, 87, 0.58)', bg: 'rgba(46, 28, 0, 0.92)' },
                    chance: { color: '#FFF1C8', border: 'rgba(255, 215, 64, 0.72)', bg: 'rgba(65, 36, 3, 0.95)' },
                },
                haptic: { peek: [28, 22, 30], chance: [35, 20, 70] },
            },
            VOID: {
                miiText: {
                    default: { color: '#E5DBFF', border: 'rgba(168, 130, 255, 0.58)', bg: 'rgba(24, 12, 45, 0.92)' },
                    chance: { color: '#D8FFFA', border: 'rgba(112, 239, 215, 0.68)', bg: 'rgba(18, 15, 48, 0.95)' },
                },
                haptic: { peek: [16, 26, 16], chance: [18, 18, 46, 18, 28] },
            },
            ARC: {
                miiText: {
                    default: { color: '#D8FFFF', border: 'rgba(0, 235, 255, 0.62)', bg: 'rgba(0, 37, 53, 0.9)' },
                    chance: { color: '#EEFFFF', border: 'rgba(131, 247, 255, 0.8)', bg: 'rgba(0, 52, 74, 0.94)' },
                },
                haptic: { peek: [14, 12, 14, 12, 14], chance: [16, 10, 24, 10, 38] },
            },
            LIFE: {
                miiText: {
                    default: { color: '#D9FFE0', border: 'rgba(90, 226, 128, 0.52)', bg: 'rgba(7, 37, 18, 0.9)' },
                    chance: { color: '#ECFFE6', border: 'rgba(113, 255, 168, 0.7)', bg: 'rgba(4, 46, 18, 0.95)' },
                },
                haptic: { peek: [18, 28, 18], chance: [24, 18, 48] },
            },
        };

        function buildCardbackConfig(imagePath, theme, glow, miiFxProfile) {
            const preset = MII_PROFILE_PRESETS[miiFxProfile] || MII_PROFILE_PRESETS.CRYSTAL;
            return {
                image: `url('${imagePath}')`,
                theme,
                glow,
                miiFxProfile,
                sfxProfile: miiFxProfile,
                miiText: preset.miiText,
                hapticProfile: preset.haptic,
            };
        }

        const CARDBACK_REGISTRY = {
            classic: buildCardbackConfig('../cardback/classic.png', 'CRYSTAL', 'rgba(255, 215, 0, 0.9)', 'CRYSTAL'),
            classic_blue: buildCardbackConfig('../cardback/classic.png', 'CRYSTAL', 'rgba(100, 180, 255, 0.9)', 'CRYSTAL'),
            classic_red: buildCardbackConfig('../cardback/classic.png', 'CRYSTAL', 'rgba(255, 100, 120, 0.9)', 'CRYSTAL'),
            retro_gold: buildCardbackConfig('../cardback/lucky3_retro_classic_gold.png', 'FORGE_GOLD', 'rgba(218, 165, 32, 1)', 'FORGE'),
            nightgold: buildCardbackConfig('../cardback/nightgold.png', 'EMBER_DARK', 'rgba(218, 165, 32, 0.95)', 'FORGE'),
            forest: buildCardbackConfig('../cardback/forest.png', 'LIFE_FOREST', 'rgba(60, 220, 80, 0.85)', 'LIFE'),
            crimson: buildCardbackConfig('../cardback/crimson.png', 'EMBER_BRIGHT', 'rgba(255, 60, 40, 0.9)', 'FORGE'),
            void: buildCardbackConfig('../cardback/void.png', 'VOID_PURPLE', 'rgba(180, 120, 255, 0.9)', 'VOID'),
            lucky: buildCardbackConfig('../cardback/lucky.png', 'LIFE_FESTIVE', 'rgba(255, 215, 0, 0.9)', 'LIFE'),
            combo5: buildCardbackConfig('../cardback/combo5.png', 'ARC_CYAN', 'rgba(40, 220, 255, 0.95)', 'ARC'),
            speed18: buildCardbackConfig('../cardback/speed18.png', 'ARC_GREEN', 'rgba(120, 190, 255, 0.9)', 'ARC'),
            ironwill: buildCardbackConfig('../cardback/ironwill.png', 'FORGE_STEEL', 'rgba(200, 210, 230, 0.85)', 'FORGE'),
            suitcollector: buildCardbackConfig('../cardback/suitcollector.png', 'LIFE_SUIT', 'rgba(255, 215, 0, 0.9)', 'LIFE'),
            luckydraw: buildCardbackConfig('../cardback/luckydraw.png', 'VOID_DARK', 'rgba(218, 165, 32, 0.9)', 'VOID'),
            fullsweep: buildCardbackConfig('../cardback/fullsweep.png', 'FORGE_ROYAL', 'rgba(80, 255, 130, 0.85)', 'FORGE'),
            dailyregular: buildCardbackConfig('../cardback/dailyregular.png', 'LIFE_STELLAR', 'rgba(255, 200, 80, 0.9)', 'LIFE'),
            chainreaction: buildCardbackConfig('../cardback/chainreaction.png', 'ARC_CYAN', 'rgba(120, 190, 255, 0.95)', 'ARC'),
            // Extreme Challenge rewards — themed to match the cardback art
            shilian:  buildCardbackConfig('../cardback/shilian.png',  'FORGE_STEEL',  'rgba(192, 192, 192, 0.85)', 'FORGE'),
            tianzhu:  buildCardbackConfig('../cardback/tianzhu.png',  'ARC_CYAN',     'rgba(160, 200, 232, 0.9)',  'ARC'),
            xingbao:  buildCardbackConfig('../cardback/xingbao.png',  'EMBER_BRIGHT', 'rgba(255, 170, 68, 0.95)',  'FORGE'),
            lunhui:   buildCardbackConfig('../cardback/lunhui.png',   'LIFE_FOREST',  'rgba(136, 221, 170, 0.9)',  'LIFE'),
            jufeng:   buildCardbackConfig('../cardback/jufeng.png',   'ARC_GREEN',    'rgba(170, 238, 221, 0.9)',  'ARC'),
            yongheng: buildCardbackConfig('../cardback/yongheng.png', 'FORGE_ROYAL',  'rgba(255, 215, 0, 1.0)',    'FORGE'),
        };

        let activeCardbackId = 'classic';

        function getCardbackConfig(id) {
            return CARDBACK_REGISTRY[id] || CARDBACK_REGISTRY.classic;
        }

        function getCurrentCardbackId() {
            if (activeCardbackId && CARDBACK_REGISTRY[activeCardbackId]) return activeCardbackId;
            const saved = localStorage.getItem(CARD_BACK_KEY) || 'classic';
            return CARDBACK_REGISTRY[saved] ? saved : 'classic';
        }

        function getCurrentCardbackConfig() {
            return getCardbackConfig(getCurrentCardbackId());
        }

        const SUIT_THEME_COLORS = {
            '♠': ['#263238', '#90A4AE'],
            '♥': ['#C62828', '#FFCDD2'],
            '♦': ['#E65100', '#FFF9C4'],
            '♣': ['#1B5E20', '#A5D6A7'],
        };

        const THEME_CONFIGS = {
            CRYSTAL: {
                colors: ['#B3E5FC', '#FFFFFF'], shape: 'shard',
                gravity: 0.12, friction: 0.978, rotSpeed: [0.04, 0.07], sizeDecay: 0.97,
                clear:       { count: 12, speed: [2.5, 4.0], life: [600, 850] },
                columnClear: { count: 22, speed: [2.0, 3.5], life: [700, 1000], beamColor: '#81D4FA', glowColor: 'rgba(129,212,250,0.4)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            EMBER_BRIGHT: {
                colors: ['#FF4500', '#FFEA00'], shape: 'circle', speedDir: 'up',
                gravity: -0.14, friction: 0.965, rotSpeed: [0, 0], sizeDecay: 0.93,
                clear:       { count: 12, speed: [3.0, 5.5], life: [300, 450] },
                columnClear: { count: 28, speed: [2.0, 4.5], life: [350, 600], beamColor: '#FF4500', glowColor: 'rgba(255,69,0,0.35)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            EMBER_DARK: {
                colors: ['#B34700', '#FFD700'], shape: 'circle', speedDir: 'up',
                gravity: -0.12, friction: 0.968, rotSpeed: [0, 0], sizeDecay: 0.94,
                clear:       { count: 11, speed: [2.5, 4.5], life: [350, 500] },
                columnClear: { count: 25, speed: [2.0, 4.0], life: [400, 650], beamColor: '#B34700', glowColor: 'rgba(179,71,0,0.35)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            FORGE_GOLD: {
                colors: ['#FFD700', '#FFFFFF'], shape: 'square',
                gravity: 0.55, friction: 0.975, rotSpeed: [0.10, 0.15], sizeDecay: 0.97,
                clear:       { count: 9, speed: [2.8, 4.5], life: [600, 900], sparkCount: 3 },
                columnClear: { count: 20, speed: [2.5, 4.0], life: [700, 1000], sparkCount: 8, beamColor: '#FFD700', glowColor: 'rgba(255,215,0,0.4)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            FORGE_STEEL: {
                colors: ['#90A4AE', '#FF8C00'], shape: 'square',
                gravity: 0.55, friction: 0.975, rotSpeed: [0.10, 0.15], sizeDecay: 0.97,
                clear:       { count: 9, speed: [2.8, 4.5], life: [600, 900], sparkCount: 3 },
                columnClear: { count: 20, speed: [2.5, 4.0], life: [700, 1000], sparkCount: 8, beamColor: '#90A4AE', glowColor: 'rgba(144,164,174,0.35)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            FORGE_ROYAL: {
                colors: ['#9C27B0', '#FFD700'], shape: 'square',
                gravity: 0.55, friction: 0.975, rotSpeed: [0.10, 0.15], sizeDecay: 0.97,
                clear:       { count: 9, speed: [2.8, 4.5], life: [600, 900], sparkCount: 3 },
                columnClear: { count: 20, speed: [2.5, 4.0], life: [700, 1000], sparkCount: 8, beamColor: '#9C27B0', glowColor: 'rgba(156,39,176,0.4)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            VOID_PURPLE: {
                colors: ['#7C4DFF', '#00BFA5'], shape: 'circle',
                gravity: -0.02, friction: 0.99, rotSpeed: [0, 0], sizeDecay: 0.985,
                clear:       { count: 12, speed: [0.8, 2.0], life: [900, 1200] },
                columnClear: { count: 20, speed: [0.6, 1.8], life: [1000, 1400], beamColor: '#7C4DFF', glowColor: 'rgba(124,77,255,0.35)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            VOID_DARK: {
                colors: ['#424242', '#9E9E9E'], shape: 'circle',
                gravity: -0.02, friction: 0.99, rotSpeed: [0, 0], sizeDecay: 0.985,
                clear:       { count: 12, speed: [0.8, 2.0], life: [900, 1200] },
                columnClear: { count: 20, speed: [0.6, 1.8], life: [1000, 1400], beamColor: '#37474F', glowColor: 'rgba(55,71,79,0.3)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            ARC_CYAN: {
                colors: ['#00E5FF', '#FFFFFF'], shape: 'streak',
                gravity: 0.0, friction: 0.94, rotSpeed: [0, 0], sizeDecay: 0.90,
                clear:       { count: 8, speed: [7, 12], life: [80, 150] },
                columnClear: { count: 16, speed: [6, 11], life: [100, 180], beamColor: '#00E5FF', glowColor: 'rgba(0,229,255,0.4)' },
                combo:       { multipliers: [1.3, 1.8, 2.5], speedBoosts: [1.0, 1.2, 1.6] },
            },
            ARC_GREEN: {
                colors: ['#76FF03', '#FFFFFF'], shape: 'streak',
                gravity: 0.0, friction: 0.94, rotSpeed: [0, 0], sizeDecay: 0.90,
                clear:       { count: 8, speed: [7, 12], life: [80, 150] },
                columnClear: { count: 16, speed: [6, 11], life: [100, 180], beamColor: '#76FF03', glowColor: 'rgba(118,255,3,0.4)' },
                combo:       { multipliers: [1.3, 1.8, 2.5], speedBoosts: [1.0, 1.2, 1.6] },
            },
            LIFE_FOREST: {
                colors: ['#4CAF50', '#8D6E63'], shape: 'square', airDrift: 0.015,
                gravity: 0.06, friction: 0.988, rotSpeed: [0.05, 0.15], sizeDecay: 0.984,
                clear:       { count: 11, speed: [2.0, 3.5], life: [800, 1100] },
                columnClear: { count: 24, speed: [1.5, 3.0], life: [900, 1300], beamColor: '#4CAF50', glowColor: 'rgba(76,175,80,0.35)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            LIFE_FESTIVE: {
                colors: ['#FFD700', '#FF7043'], shape: 'square', airDrift: 0.015,
                gravity: 0.06, friction: 0.988, rotSpeed: [0.05, 0.15], sizeDecay: 0.984,
                clear:       { count: 11, speed: [2.0, 3.5], life: [800, 1100] },
                columnClear: { count: 24, speed: [1.5, 3.0], life: [900, 1300], beamColor: '#FFD700', glowColor: 'rgba(255,215,0,0.4)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            LIFE_SUIT: {
                colors: ['#FFD700', '#FFFFFF'], shape: 'square', airDrift: 0.012,
                gravity: 0.06, friction: 0.988, rotSpeed: [0.05, 0.15], sizeDecay: 0.984,
                clear:       { count: 11, speed: [2.0, 3.5], life: [800, 1100] },
                columnClear: { count: 24, speed: [1.5, 3.0], life: [900, 1300], beamColor: '#FFD700', glowColor: 'rgba(255,215,0,0.35)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
            LIFE_STELLAR: {
                colors: ['#1565C0', '#E3F2FD'], shape: 'star', airDrift: 0.008,
                gravity: 0.04, friction: 0.990, rotSpeed: [0.02, 0.06], sizeDecay: 0.986,
                clear:       { count: 10, speed: [1.5, 3.0], life: [900, 1200] },
                columnClear: { count: 22, speed: [1.2, 2.8], life: [1000, 1400], beamColor: '#1565C0', glowColor: 'rgba(21,101,192,0.35)' },
                combo:       { multipliers: [1.3, 1.8, 2.5] },
            },
        };

        // Ensure all themes have a dedicated miiPeek trigger config.
        Object.values(THEME_CONFIGS).forEach((cfg) => {
            if (cfg.miiPeek) return;
            const base = cfg.clear || {};
            const speed = Array.isArray(base.speed) ? base.speed : [2.0, 4.0];
            const life = Array.isArray(base.life) ? base.life : [600, 900];
            cfg.miiPeek = {
                count: Math.max(6, Math.round((base.count || 12) * 0.55)),
                speed: [speed[0] * 0.72, speed[1] * 0.78],
                life: [Math.round(life[0] * 0.7), Math.round(life[1] * 0.82)],
            };
        });

        function getUnlockedCardBacks() {
            const defaults = [...DEFAULT_UNLOCKED_CARD_BACKS];
            try {
                const saved = JSON.parse(localStorage.getItem(CARD_BACK_UNLOCKED) || '[]');
                const list = Array.isArray(saved) ? saved : [];
                const merged = [...new Set([...defaults, ...list])];
                return merged;
            } catch {
                return defaults;
            }
        }

        // Returns true if newly unlocked
        function unlockCardBack(id) {
            const list = getUnlockedCardBacks();
            if (list.includes(id)) return false;
            list.push(id);
            localStorage.setItem(CARD_BACK_UNLOCKED, JSON.stringify(list));
            return true;
        }

        function syncCardBackUnlocks({ showToast = false } = {}) {
            const wins = achievements.wins || 0;
            const streak = achievements.currentStreak || 0;
            const maxCombo = achievements.maxCombo || 0;
            const bestMoves = achievements.bestMoves;
            const noUndoWins = achievements.noUndoWins || 0;
            const suitWins = achievements.suitWins || {};
            const fullSweepWins = achievements.fullSweepWins || 0;
            const dailyWins = achievements.dailyWins || 0;
            const comboGameWins = achievements.comboGameWins || 0;

            // Card back unlocks are driven by achievement/progression state.
            const targets = [
                { id: 'forest', ok: wins >= 10 },         // Veteran Player milestone
                { id: 'lucky', ok: wins >= 50 },          // Grandmaster milestone
                { id: 'crimson', ok: streak >= 7 },       // Extended streak milestone
                { id: 'void', ok: wins >= 1 },            // First Win
                { id: 'nightgold', ok: (achievements.wins || 0) >= 20 }, // 20 wins milestone
                { id: 'combo5', ok: maxCombo >= 5 },      // Combo Expert
                { id: 'speed18', ok: bestMoves != null && bestMoves <= 18 }, // Speed Runner
                { id: 'ironwill', ok: noUndoWins >= 1 },  // Iron Will
                { id: 'suitcollector', ok: !!(suitWins.spade && suitWins.heart && suitWins.diamond && suitWins.club) }, // Suit Collector — explicit (Object.values({}).every is vacuously true)
                { id: 'luckydraw', ok: suitWins.spade === true }, // Lucky Draw
                { id: 'fullsweep', ok: fullSweepWins >= 1 }, // Full Sweep
                { id: 'dailyregular', ok: dailyWins >= 7 }, // Daily Regular
                { id: 'chainreaction', ok: comboGameWins >= 1 }, // Chain Reaction
                // Extreme Challenge rewards
                { id: 'shilian',  ok: !!loadChallengesData()['shilian']?.completed },
                { id: 'tianzhu',  ok: !!loadChallengesData()['tianzhu']?.completed },
                { id: 'xingbao',  ok: !!loadChallengesData()['xingbao']?.completed },
                { id: 'lunhui',   ok: !!loadChallengesData()['lunhui']?.completed },
                { id: 'jufeng',   ok: !!loadChallengesData()['jufeng']?.completed },
                { id: 'yongheng', ok: !!loadChallengesData()['yongheng']?.completed },
            ];

            for (const target of targets) {
                if (!target.ok) continue;
                if (!unlockCardBack(target.id)) continue;
                if (!showToast) continue;
                const cb = CARD_BACKS.find((c) => c.id === target.id);
                if (!cb) continue;
                const name = currentLocale === 'zh-Hant' ? cb.nameZH : cb.nameEN;
                showAchievementToast(t('cardback.unlock_toast'), name);
            }
        }

        function applyCardBack(id) {
            const pile = document.getElementById('deck-pile');
            if (!pile) return;
            const safeId = CARDBACK_REGISTRY[id] ? id : 'classic';
            const cfg = getCardbackConfig(safeId);
            pile.classList.forEach(cls => { if (cls.startsWith('cb-')) pile.classList.remove(cls); });
            if (safeId && safeId !== 'classic') pile.classList.add(`cb-${safeId}`);
            activeCardbackId = safeId;
            localStorage.setItem(CARD_BACK_KEY, safeId);
            pile.dataset.cardback = safeId;

            const rootStyle = document.documentElement.style;
            rootStyle.setProperty('--cardback-image', cfg.image);
            rootStyle.setProperty('--mii-glow-color', cfg.glow || 'rgba(255, 215, 0, 0.9)');
            rootStyle.setProperty('--mii-text-color', cfg.miiText?.default?.color || '#fff');
            rootStyle.setProperty('--mii-text-border', cfg.miiText?.default?.border || 'rgba(255, 255, 255, 0.4)');
            rootStyle.setProperty('--mii-text-bg', cfg.miiText?.default?.bg || 'rgba(16, 18, 20, 0.88)');
        }

        function loadCardBack() {
            applyCardBack(localStorage.getItem(CARD_BACK_KEY) || 'classic');
        }

        function selectCardBack(id) {
            if (!getUnlockedCardBacks().includes(id)) return;
            applyCardBack(id);
            renderCardBackGrid();
        }

        function renderCardBackGrid() {
            const grid = document.getElementById('cb-grid');
            if (!grid) return;
            const unlocked = getUnlockedCardBacks();
            const current  = localStorage.getItem(CARD_BACK_KEY) || 'classic';
            const isZH     = currentLocale === 'zh-Hant';
            const LOCK_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`;
            grid.innerHTML = CARD_BACKS.map(cb => {
                const isUnlocked = unlocked.includes(cb.id);
                const isSelected = cb.id === current;
                const name       = isZH ? cb.nameZH : cb.nameEN;
                const hint       = isZH ? cb.condZH  : cb.condEN;
                return `<div class="cb-item${isSelected ? ' cb-selected' : ''}${!isUnlocked ? ' cb-locked' : ''}"
                             onclick="${isUnlocked ? `selectCardBack('${cb.id}')` : ''}">
                    <div class="cb-preview cb-preview-${cb.id}">
                        ${!isUnlocked ? `<div class="cb-lock-icon">${LOCK_SVG}</div>` : ''}
                        ${isSelected  ? '<div class="cb-selected-mark">✓</div>' : ''}
                    </div>
                    <div class="cb-name">${name}</div>
                    ${!isUnlocked ? `<div class="cb-hint">${hint}</div>` : ''}
                </div>`;
            }).join('');
        }
        // ── End Card Back Collection ────────────────────────────────────────────

        // ── Home Screen ────────────────────────────────────────────────────────
        function centerHomeContent() {
            const hs = document.getElementById('home-screen');
            const hc = hs && hs.querySelector('.home-content');
            if (!hs || !hc) return;
            // 先重置，測量真實高度
            hc.style.marginTop = '';
            hc.style.marginBottom = '';
            const hsH = hs.clientHeight || window.innerHeight;
            const hcH = hc.offsetHeight;
            if (hcH > 0 && hsH > hcH) {
                const pad = Math.round((hsH - hcH) / 2);
                hc.style.marginTop = pad + 'px';
                hc.style.marginBottom = pad + 'px';
            }
        }

        function showHomeScreen() {
            const el = document.getElementById('home-screen');
            if (!el) return;
            // 有儲存的進度才顯示「繼續」
            const continueBtn = document.getElementById('home-btn-continue');
            if (continueBtn) {
                const hasSave = !!localStorage.getItem(GAME_STATE_KEY);
                continueBtn.style.display = hasSave ? 'block' : 'none';
            }
            const verEl = document.getElementById('home-ver');
            if (verEl) verEl.textContent = `v${APP_VERSION}`;
            el.classList.remove('hiding');
            el.style.display = 'flex';
            // margin: auto 應自動居中；JS 作為 WKWebView fallback
            requestAnimationFrame(() => setTimeout(() => centerHomeContent(), 50));
            updateFocusWidget();
        }

        function hideHomeScreen(cb) {
            const el = document.getElementById('home-screen');
            if (!el || el.style.display === 'none') { cb?.(); return; }
            el.classList.add('hiding');
            setTimeout(() => {
                el.style.display = 'none';
                el.classList.remove('hiding');
                cb?.();
            }, 390);
        }

        function homeNewGame() {
            hideHomeScreen(() => {
                if (!isTutorialDismissed()) {
                    tutorialDeckMode = true;
                    init(true, { mode: 'normal' });
                } else {
                    init(true, { mode: 'normal' });
                }
            });
        }

        function homeContinue() {
            hideHomeScreen(() => init(false, { mode: 'normal' }));
        }

        function homeDailyChallenge() {
            hideHomeScreen(() => init(true, { mode: 'daily' }));
        }

        function homeOpenSettings() {
            toggleSettings(true);
        }

        function homeOpenAchievements() {
            openAchievements();
        }

        function homeOpenLeaderboard() {
            openDailyLeaderboard();
        }
        // ── End Home Screen ────────────────────────────────────────────────────

        async function setupDailyNotification(enabled) {
            const LN = window.Capacitor?.Plugins?.LocalNotifications;
            if (!LN) return;
            const NOTIF_ID = 1001;

            // 先取消已排程的通知
            try { await LN.cancel({ notifications: [{ id: NOTIF_ID }] }); } catch (_) {}
            if (!enabled) return;

            // 請求權限
            let perm;
            try { perm = await LN.requestPermissions(); } catch (_) { return; }
            if (perm.display !== 'granted') {
                settings.dailyNotif = false;
                saveSettings();
                const el = document.getElementById('setting-daily-notif');
                if (el) el.checked = false;
                return;
            }

            // 下一個 09:00 開始，每天重複
            const next = new Date();
            next.setHours(9, 0, 0, 0);
            if (next <= new Date()) next.setDate(next.getDate() + 1);

            const TITLES = {
                'zh-Hant': '🃏 Lucky 3 每日挑戰',
                'zh-Hans': '🃏 Lucky 3 每日挑战',
                'ja':      '🃏 Lucky 3 デイリーチャレンジ',
                'ko':      '🃏 Lucky 3 오늘의 도전',
                'en':      '🃏 Lucky 3 Daily Challenge',
            };
            const BODIES = {
                'zh-Hant': '今天的挑戰已出爐，快來挑戰！',
                'zh-Hans': '今天的挑战来了，快来试试！',
                'ja':      '本日のパズルが公開されました。挑戦しましょう！',
                'ko':      '오늘의 퍼즐이 공개되었습니다. 도전해보세요!',
                'en':      "Today's puzzle is ready. Can you beat it?",
            };
            const loc = currentLocale || 'en';
            const title = TITLES[loc] || TITLES['en'];
            const body  = BODIES[loc]  || BODIES['en'];

            try {
                await LN.schedule({
                    notifications: [{
                        id: NOTIF_ID,
                        title,
                        body,
                        schedule: { at: next, repeats: true, every: 'day' },
                        sound: null,
                        actionTypeId: '',
                        extra: {}
                    }]
                });
            } catch (_) {}
        }

        function bindSettingsUI() {
            ensureGalleryEntryButtons();
            const soundEl = document.getElementById('setting-sound');
            const vibrationEl = document.getElementById('setting-vibration');
            const speedEl = document.getElementById('setting-animation-speed');
            const cardRankScaleEl = document.getElementById('setting-card-rank-scale');
            const cardSuitScaleEl = document.getElementById('setting-card-suit-scale');
            const languageEl = document.getElementById('setting-language');
            const contrastEl = document.getElementById('setting-high-contrast');
            const miiPeekEl = document.getElementById('setting-mii-peek');
            const recycleAnimEl = document.getElementById('setting-recycle-anim');
            if (!soundEl || !vibrationEl || !speedEl || !languageEl || !contrastEl || !miiPeekEl || !recycleAnimEl) return;

            soundEl.addEventListener('change', (e) => updateSetting('sound', e.target.checked));
            vibrationEl.addEventListener('change', (e) => updateSetting('vibration', e.target.checked));
            if (IS_IOS) {
                const vibRow = document.querySelector('.setting-row-vibration') ||
                               document.getElementById('toggle-vibration')?.closest('.setting-row') ||
                               vibrationEl.closest('.setting-row');
                if (vibRow && !vibRow.querySelector('.ios-note')) {
                    const note = document.createElement('span');
                    note.className = 'ios-note';
                    note.style.cssText = 'font-size:0.72rem;opacity:0.6;margin-left:6px;color:#afd;';
                    note.textContent = '(iOS: requires App)';
                    vibrationEl.after(note);
                }
            }
            speedEl.addEventListener('change', (e) => updateSetting('animationSpeed', e.target.value));
            cardRankScaleEl?.addEventListener('input', (e) => {
                const pct = Number(e.target.value);
                updateSetting('cardRankScale', normalizeCardScale(pct / 100));
            });
            cardSuitScaleEl?.addEventListener('input', (e) => {
                const pct = Number(e.target.value);
                updateSetting('cardSuitScale', normalizeCardScale(pct / 100));
            });
            languageEl.addEventListener('change', (e) => setLocale(e.target.value));
            contrastEl.addEventListener('change', (e) => updateSetting('highContrast', e.target.checked));
            miiPeekEl.addEventListener('change', (e) => updateSetting('miiPeek', e.target.checked));
            recycleAnimEl.addEventListener('change', (e) => updateSetting('recycleAnim', e.target.checked));
            document.getElementById('setting-sum-helper')?.addEventListener('change', (e) => updateSetting('sumHelper', e.target.checked));
            document.getElementById('setting-daily-notif')?.addEventListener('change', async (e) => {
                settings.dailyNotif = e.target.checked;
                saveSettings();
                await setupDailyNotification(settings.dailyNotif);
            });
            document.getElementById('setting-bgm')?.addEventListener('change', e => {
                settings.bgm = e.target.checked;
                saveSettings();
                BGM.sync(settings.bgm);
            });
            document.getElementById('setting-player-name').addEventListener('blur', () => {
                const trimmed = document.getElementById('setting-player-name').value.trim().slice(0, 12);
                localStorage.setItem('lucky3-player-name', trimmed);
            });

            const titleEl = document.querySelector('.settings-title');
            if (titleEl && !titleEl.dataset.devBound) {
                titleEl.dataset.devBound = '1';
                titleEl.addEventListener('click', () => {
                    devTapCount += 1;
                    if (devTapTimer) clearTimeout(devTapTimer);
                    devTapTimer = setTimeout(() => {
                        devTapCount = 0;
                    }, 1200);

                    if (devTapCount >= 7) {
                        devTapCount = 0;
                        developerMode = !developerMode;
                        saveDeveloperMode();
                        showAchievementToast(
                            developerMode ? t('toast.dev_on_title') : t('toast.dev_off_title'),
                            developerMode ? t('toast.dev_on_body') : t('toast.dev_off_body')
                        );
                    }
                });
            }
            const versionEl = document.getElementById('setting-version');
            if (versionEl && !versionEl.dataset.cheatBound) {
                versionEl.dataset.cheatBound = '1';
                versionEl.addEventListener('click', () => {
                    cheatTapCount += 1;
                    if (cheatTapTimer) clearTimeout(cheatTapTimer);
                    cheatTapTimer = setTimeout(() => {
                        cheatTapCount = 0;
                    }, 1200);

                    if (cheatTapCount >= 5) {
                        cheatTapCount = 0;
                        seedCheatMode = !seedCheatMode;
                        saveSeedCheatMode();
                        showAchievementToast(
                            seedCheatMode ? '🧪 Seed Cheat ON' : '🧪 Seed Cheat OFF',
                            seedCheatMode ? 'DEAL 會先用上方優先 greedy 自動消除，再發牌。' : '已關閉 seed 測試自動消除。'
                        );
                    }
                });
            }
        }

        function getTutorialState() {
            try {
                return localStorage.getItem(TUTORIAL_STATE_KEY) || 'unseen';
            } catch (_) {
                return 'unseen';
            }
        }

        function isTutorialDismissed() {
            const state = getTutorialState();
            return state === 'completed' || state === 'skipped';
        }

        function setTutorialState(state) {
            try {
                localStorage.setItem(TUTORIAL_STATE_KEY, state);
            } catch (_) { }
        }

        function toggleTutorial(show) {
            const overlay = document.getElementById('tutorial-overlay');
            if (!overlay) return;
            overlay.classList.toggle('show', show);
            // Drive ad-banner visibility via body class — same pattern as root.
            // Inline style would survive past the tutorial and permanently hide the banner.
            document.body.classList.toggle('is-tutorial-active', show);
        }

        function startTutorial(force = false) {
            if (!force && isTutorialDismissed()) return;
            tutorial.active = true;
            tutorial.step = 0;
            renderTutorial();
            toggleTutorial(true);
        }

        function closeTutorial(state = null) {
            tutorial.active = false;
            if (state === 'completed' || state === 'skipped') setTutorialState(state);
            toggleTutorial(false);
        }

        function replayTutorial() {
            toggleSettings(false);
            tutorialDeckMode = true;
            init(true, { mode: 'normal' });
        }

        function startDailyChallenge() {
            toggleSettings(false);
            init(true, { mode: 'daily' });
        }

        function nextTutorialStep() {
            tutorial.step = Math.min(4, tutorial.step + 1);
            if (tutorial.step === 4) {
                setTutorialState('completed');
                playSound('hint');
            }
            renderTutorial();
        }

        function renderTutorial() {
            if (!tutorial.active) return;
            const title = document.getElementById('tutorial-title');
            const body = document.getElementById('tutorial-body');
            const status = document.getElementById('tutorial-status');
            const primary = document.getElementById('tutorial-primary');
            const secondary = document.getElementById('tutorial-secondary');
            if (!title || !body || !status || !primary || !secondary) return;

            if (tutorial.step === 0) {
                title.innerText = t('tutorial.step0.title');
                body.innerText = t('tutorial.step0.body');
                status.innerText = t('tutorial.step0.status');
                primary.innerText = t('tutorial.step0.primary');
                secondary.innerText = t('tutorial.step0.secondary');
                primary.onclick = () => { tutorial.step = 1; renderTutorial(); };
                secondary.onclick = () => closeTutorial('skipped');
                primary.style.display = '';
                secondary.style.display = '';
                return;
            }

            if (tutorial.step === 1) {
                title.innerText = t('tutorial.step1.title');
                body.innerText = t('tutorial.step1.body');
                status.innerText = t('tutorial.step1.status');
                primary.style.display = 'none';
                secondary.style.display = '';
                secondary.innerText = t('tutorial.stepX.secondary');
                secondary.onclick = () => closeTutorial('skipped');
                return;
            }

            if (tutorial.step === 2) {
                title.innerText = t('tutorial.step2.title');
                body.innerText = t('tutorial.step2.body');
                status.innerText = t('tutorial.step2.status');
                primary.style.display = 'none';
                secondary.style.display = '';
                secondary.innerText = t('tutorial.stepX.secondary');
                secondary.onclick = () => closeTutorial('skipped');
                return;
            }

            title.innerText = t('tutorial.done.title');
            body.innerText = t('tutorial.done.body');
            status.innerText = t('tutorial.done.status');
            primary.style.display = '';
            secondary.style.display = 'none';
            primary.innerText = t('tutorial.done.primary');
            primary.onclick = () => closeTutorial('completed');
        }

        function onTutorialEvent(eventName) {
            if (!tutorial.active) return;
            if (tutorial.step === 1 && eventName === 'deal') {
                nextTutorialStep();
                return;
            }
            if (tutorial.step === 2 && eventName === 'attempt_clear_success') {
                tutorial.step = 4;
                setTutorialState('completed');
                playSound('hint');
                renderTutorial();
            }
        }

        function isLegalSelectionPosition(cardsLen, selectedIndices) {
            if (cardsLen < 3 || selectedIndices.length !== 3) return false;
            const sorted = [...selectedIndices].sort((a, b) => a - b);
            const legal =
                JSON.stringify(sorted) === JSON.stringify([cardsLen - 3, cardsLen - 2, cardsLen - 1]) ||
                JSON.stringify(sorted) === JSON.stringify([0, cardsLen - 2, cardsLen - 1]) ||
                JSON.stringify(sorted) === JSON.stringify([0, 1, cardsLen - 1]);
            return legal;
        }

        function isSelectableCardIndex(cardsLen, idx) {
            if (idx < 0 || idx >= cardsLen) return false;
            const topMax = Math.min(cardsLen - 1, 1);         // top 2 (oldest)
            const bottomMin = Math.max(0, cardsLen - 3);      // bottom 3 (newest)
            return idx <= topMax || idx >= bottomMin;
        }

        function isSelectionCandidateCard(slot, idx, selectedIndices = []) {
            if (!slot || selectedIndices.length < 1 || selectedIndices.length > 2) return false;
            if (selectedIndices.includes(idx)) return false;
            return getLegalClearIndices(slot.cards).some((indices) => {
                if (!indices.includes(idx)) return false;
                return selectedIndices.every((selectedIdx) => indices.includes(selectedIdx));
            });
        }

        function getSelectionFeedback(slot) {
            const selectedIndices = selected
                .filter((s) => s.slotId === slot.id)
                .map((s) => s.idx)
                .sort((a, b) => a - b);
            const isComplete = selectedIndices.length === 3;
            const sum = isComplete
                ? selectedIndices.reduce((acc, idx) => acc + (slot.cards[idx]?.val ?? 0), 0)
                : 0;
            const isValidComplete = isComplete &&
                isLegalSelectionPosition(slot.cards.length, selectedIndices) &&
                [9, 19, 29].includes(sum);
            const candidateIndices = new Set();

            if (selectedIndices.length === 1 || selectedIndices.length === 2) {
                slot.cards.forEach((_, idx) => {
                    if (isSelectionCandidateCard(slot, idx, selectedIndices)) {
                        candidateIndices.add(idx);
                    }
                });
            }

            return { selectedIndices, isComplete, isValidComplete, sum, candidateIndices };
        }

        function setMajorComboFocusLock(durationMs) {
            comboFocusActive = true;
            document.body.classList.add('major-combo-active');
            if (comboFocusTimer) clearTimeout(comboFocusTimer);
            comboFocusTimer = setTimeout(() => {
                comboFocusActive = false;
                comboFocusTimer = null;
                document.body.classList.remove('major-combo-active');
            }, durationMs);
        }

        function showTutorialRuleHint() {
            const old = document.getElementById('need-three-tip');
            if (old) old.remove();
            const msg = document.createElement('div');
            msg.id = 'need-three-tip';
            msg.className = 'need-three-tip rule-hint';
            msg.innerText = t('tutorial.rule_hint');
            document.body.appendChild(msg);
            triggerHaptic([18, 24, 18]);
            playSound('hint');
            setTimeout(() => {
                if (msg.parentNode) msg.remove();
            }, getDelay(1300));
        }

        // === Canvas Particle System ===
        const ParticleSystem = (() => {
            const canvas = document.getElementById('particle-canvas');
            const ctx = canvas ? canvas.getContext('2d') : null;
            const particles = [];
            const MAX_PARTICLES = (() => {
                const cores = navigator.hardwareConcurrency || 2;
                if (cores >= 6) return 800;
                if (cores >= 4) return 500;
                return 300;
            })();
            let running = false;
            let dpr = Math.min(window.devicePixelRatio || 1, 2);

            function resize() {
                if (!canvas) return;
                dpr = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                canvas.style.width = window.innerWidth + 'px';
                canvas.style.height = window.innerHeight + 'px';
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            window.addEventListener('resize', resize);
            resize();

            function lerpColor(a, b, t) {
                const ar = parseInt(a.slice(1, 3), 16), ag = parseInt(a.slice(3, 5), 16), ab = parseInt(a.slice(5, 7), 16);
                const br = parseInt(b.slice(1, 3), 16), bg = parseInt(b.slice(3, 5), 16), bb = parseInt(b.slice(5, 7), 16);
                const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), bv = Math.round(ab + (bb - ab) * t);
                return `rgb(${r},${g},${bv})`;
            }

            function drawStar(cx, cy, r, rot) {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rot);
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            const presets = {
                burst: (x, y, opts = {}) => {
                    const count = opts.count || 18;
                    for (let i = 0; i < count; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 1.5 + Math.random() * 3;
                        add({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, gravity: 0.3, friction: 0.98, life: 600 + Math.random() * 300, size: 3 + Math.random() * 3, sizeDecay: 0.96, colorStart: opts.colorStart || '#ffd700', colorEnd: opts.colorEnd || '#ff6600', shape: Math.random() > 0.5 ? 'circle' : 'star', rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.2 });
                    }
                },
                fountain: (x, y, opts = {}) => {
                    const count = opts.count || 20;
                    for (let i = 0; i < count; i++) {
                        add({ x, y, vx: (Math.random() - 0.5) * 3, vy: -3 - Math.random() * 4, gravity: 0.5, friction: 0.97, life: 500 + Math.random() * 400, size: 2.5 + Math.random() * 2.5, sizeDecay: 0.97, colorStart: opts.colorStart || '#ffd700', colorEnd: opts.colorEnd || '#ffaa00', shape: 'circle', rotation: 0, rotSpeed: 0 });
                    }
                },
                confetti: (x, y, opts = {}) => {
                    const count = opts.count || 30;
                    const colors = ['#ffd700', '#ffe48a', '#fff5cc', '#ffcc44', '#ffffff', '#ffb347'];
                    for (let i = 0; i < count; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 0.8 + Math.random() * 2.8;
                        const c = colors[Math.floor(Math.random() * colors.length)];
                        add({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.2, gravity: 0.1, friction: 0.985, life: 1000 + Math.random() * 400, size: 2.5 + Math.random() * 2.5, sizeDecay: 0.985, colorStart: c, colorEnd: '#ffd70066', shape: 'square', rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.2 });
                    }
                },
                fireworks: (x, y, opts = {}) => {
                    const count = opts.count || 35;
                    const colors = ['#ffd700', '#ffe48a', '#ffffff', '#ffcc44', '#ffb347'];
                    // Rise phase (trail)
                    const riseY = y + 80 + Math.random() * 60;
                    for (let t = 0; t < 5; t++) {
                        add({ x: x + (Math.random() - 0.5) * 4, y: riseY - t * 15, vx: (Math.random() - 0.5) * 0.5, vy: -0.5, gravity: 0.02, friction: 0.99, life: 200 + t * 40, size: 2, sizeDecay: 0.95, colorStart: '#ffd700', colorEnd: '#ff6600', shape: 'circle', rotation: 0, rotSpeed: 0 });
                    }
                    // Burst phase (delayed)
                    setTimeout(() => {
                        for (let i = 0; i < count; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = 1.5 + Math.random() * 4;
                            const c = colors[Math.floor(Math.random() * colors.length)];
                            add({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, gravity: 0.12, friction: 0.975, life: 800 + Math.random() * 400, size: 2 + Math.random() * 2.5, sizeDecay: 0.975, colorStart: c, colorEnd: '#cc8800', shape: Math.random() > 0.6 ? 'star' : 'circle', rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.12 });
                        }
                    }, getDelay(180));
                },
                dust: (x, y, opts = {}) => {
                    const count = opts.count || 4;
                    for (let i = 0; i < count; i++) {
                        add({ x: x + (Math.random() - 0.5) * 16, y, vx: (Math.random() - 0.5) * 1, vy: -0.3 - Math.random() * 1, gravity: 0.03, friction: 0.96, life: 200 + Math.random() * 150, size: 1 + Math.random() * 1.5, sizeDecay: 0.93, colorStart: '#ffe8b0', colorEnd: '#aa885544', shape: 'circle', rotation: 0, rotSpeed: 0 });
                    }
                },
                discardTrail: (x, y, opts = {}) => {
                    const tx = Number.isFinite(opts.tx) ? opts.tx : x + 80;
                    const ty = Number.isFinite(opts.ty) ? opts.ty : y;
                    const count = opts.count || 3;
                    const dx = tx - x;
                    const dy = ty - y;
                    const dist = Math.max(1, Math.hypot(dx, dy));
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const px = -ny;
                    const py = nx;
                    for (let i = 0; i < count; i++) {
                        const spread = (i - (count - 1) / 2) * 0.35;
                        const speed = 2.3 + Math.random() * 1.6;
                        add({
                            x: x + nx * i * 4,
                            y: y + ny * i * 4,
                            vx: nx * speed + px * spread + (Math.random() - 0.5) * 0.35,
                            vy: ny * speed + py * spread + (Math.random() - 0.5) * 0.35,
                            gravity: 0.02,
                            friction: 0.98,
                            life: 220 + Math.random() * 120,
                            size: 1.5 + Math.random() * 1.3,
                            sizeDecay: 0.955,
                            colorStart: opts.colorStart || '#fff2b0',
                            colorEnd: opts.colorEnd || '#ffcc6680',
                            shape: 'circle',
                            rotation: 0,
                            rotSpeed: 0
                        });
                    }
                },
                shatter: (x, y, opts = {}) => {
                    const count = opts.count || 8;
                    const dir = opts.dir || 0;
                    for (let i = 0; i < count; i++) {
                        const angle = dir + (Math.random() - 0.5) * 1.2;
                        const speed = 1.5 + Math.random() * 2.5;
                        add({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.8, gravity: 0.3, friction: 0.97, life: 350 + Math.random() * 250, size: 2 + Math.random() * 3, sizeDecay: 0.96, colorStart: '#ffe8b0', colorEnd: '#cc9944', shape: 'square', rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.2 });
                    }
                },
                ribbon: (x, y, opts = {}) => {
                    const count = opts.count || 14;
                    const colors = ['#ffd700','#ff6b9d','#00c9ff','#a8ff78','#ffe48a','#ff9f43'];
                    for (let i = 0; i < count; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 0.8 + Math.random() * 2.5;
                        const c = colors[Math.floor(Math.random() * colors.length)];
                        add({
                            x, y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed - 1.5,
                            gravity: 0.08, friction: 0.992,
                            life: 1200 + Math.random() * 600,
                            size: 2.5 + Math.random() * 1.5, sizeDecay: 0.998,
                            colorStart: c, colorEnd: c,
                            shape: 'ribbon',
                            rotation: Math.random() * Math.PI * 2,
                            rotSpeed: (Math.random() - 0.5) * 0.35
                        });
                    }
                },
                spark: (x, y, opts = {}) => {
                    const count = opts.count || 8;
                    const dir = opts.dir !== undefined ? opts.dir : -Math.PI / 2;
                    const spread = opts.spread || 1.0;
                    for (let i = 0; i < count; i++) {
                        const angle = dir + (Math.random() - 0.5) * spread;
                        const speed = 3.5 + Math.random() * 5;
                        add({
                            x, y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            gravity: 0.05, friction: 0.93,
                            life: 120 + Math.random() * 80,
                            size: 1.5 + Math.random(), sizeDecay: 0.87,
                            colorStart: '#ffffff', colorEnd: '#ffd700',
                            shape: 'circle',
                            rotation: 0, rotSpeed: 0
                        });
                    }
                }
            };

            function add(p) {
                if (particles.length >= MAX_PARTICLES) return;
                p.maxLife = p.life;
                p.alpha = 1;
                p.trail = [];
                particles.push(p);
                if (!running) startLoop();
            }

            function startLoop() {
                if (running) return;
                running = true;
                let lastTime = performance.now();
                const loop = (now) => {
                    if (particles.length === 0) { running = false; ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr); return; }
                    const dt = Math.min(now - lastTime, 33) / 16.67;
                    lastTime = now;
                    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
                    for (let i = particles.length - 1; i >= 0; i--) {
                        const p = particles[i];
                        p.trail.push({ x: p.x, y: p.y });
                        if (p.trail.length > 4) p.trail.shift();
                        p.vx *= p.friction;
                        p.vy *= p.friction;
                        p.vy += p.gravity * dt;
                        p.x += p.vx * dt;
                        p.y += p.vy * dt;
                        p.life -= 16.67 * dt;
                        p.size *= p.sizeDecay;
                        p.rotation += p.rotSpeed * dt;
                        p.alpha = Math.max(0, p.life / p.maxLife);
                        if (p.life <= 0 || p.size < 0.3) { particles.splice(i, 1); continue; }
                        const t = 1 - p.alpha;
                        const color = lerpColor(p.colorStart, p.colorEnd, t);
                        // Draw trail
                        ctx.save();
                        for (let ti = 0; ti < p.trail.length; ti++) {
                            const ta = (ti / p.trail.length) * p.alpha * 0.25;
                            ctx.globalAlpha = ta;
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.arc(p.trail[ti].x, p.trail[ti].y, p.size * 0.4, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore();
                        // GPU-friendly glow（取代 shadowBlur）
                        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.8);
                        const ar = parseInt(p.colorStart.slice(1,3),16);
                        const ag = parseInt(p.colorStart.slice(3,5),16);
                        const ab = parseInt(p.colorStart.slice(5,7),16);
                        glow.addColorStop(0, `rgba(${ar},${ag},${ab},${(p.alpha * 0.5).toFixed(2)})`);
                        glow.addColorStop(1, 'rgba(0,0,0,0)');
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = glow;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
                        ctx.fill();
                        // Draw main particle
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = color;
                        if (p.shape === 'star') { drawStar(p.x, p.y, p.size, p.rotation); }
                        else if (p.shape === 'square') {
                            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
                            const rr = p.size * 0.15;
                            ctx.beginPath();
                            ctx.moveTo(-p.size/2 + rr, -p.size/2);
                            ctx.arcTo(p.size/2, -p.size/2, p.size/2, p.size/2, rr);
                            ctx.arcTo(p.size/2, p.size/2, -p.size/2, p.size/2, rr);
                            ctx.arcTo(-p.size/2, p.size/2, -p.size/2, -p.size/2, rr);
                            ctx.arcTo(-p.size/2, -p.size/2, p.size/2, -p.size/2, rr);
                            ctx.fill();
                            ctx.restore();
                        } else if (p.shape === 'ribbon') {
                            ctx.save();
                            ctx.translate(p.x, p.y);
                            ctx.rotate(p.rotation);
                            ctx.fillStyle = p.colorStart;
                            ctx.fillRect(-p.size * 3.5, -p.size * 0.35, p.size * 7, p.size * 0.7);
                            ctx.restore();
                        } else if (p.shape === 'shard') {
                            ctx.save();
                            ctx.translate(p.x, p.y);
                            ctx.rotate(p.rotation);
                            ctx.beginPath();
                            ctx.moveTo(0, -p.size * 1.8);
                            ctx.lineTo(p.size * 0.5, 0);
                            ctx.lineTo(p.size * 0.3, p.size);
                            ctx.lineTo(-p.size * 0.3, p.size);
                            ctx.lineTo(-p.size * 0.5, 0);
                            ctx.closePath();
                            ctx.fill();
                            ctx.restore();
                        } else if (p.shape === 'streak') {
                            const sLen = Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 3;
                            const sAngle = Math.atan2(p.vy, p.vx);
                            ctx.save();
                            ctx.translate(p.x, p.y);
                            ctx.rotate(sAngle);
                            ctx.fillRect(-sLen, -p.size * 0.4, sLen, p.size * 0.8);
                            ctx.restore();
                        } else {
                            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
                        }
                    }
                    ctx.globalAlpha = 1;
                    requestAnimationFrame(loop);
                };
                requestAnimationFrame(loop);
            }

            function emit(preset, x, y, opts) {
                if (presets[preset]) presets[preset](x, y, opts);
            }

            function clear() {
                particles.length = 0;
            }

            // Pause on hidden
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) { running = false; particles.length = 0; }
            });

            return { emit, clear, resize, spawnRaw: add };
        })();

        // === PIXI.js WebGL Ambient Layer ===
        const PixiLayer = (() => {
            if (typeof PIXI === 'undefined') return { ready: false, destroy: () => {} };

            const app = new PIXI.Application({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundAlpha: 0,
                antialias: true,
                resolution: Math.min(window.devicePixelRatio || 1, 2),
                autoDensity: true,
            });

            const canvas = app.view;
            canvas.id = 'pixi-canvas';
            canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9996;width:100%;height:100%;';
            document.body.appendChild(canvas);

            // Resize handler
            const onResize = () => {
                app.renderer.resize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', onResize);

            // === Ambient background light orbs ===
            const ambientContainer = new PIXI.Container();
            app.stage.addChild(ambientContainer);

            // Create 3 soft glowing orbs that drift slowly around the periphery
            const orbs = [];
            const orbColors = [0x1a6b3a, 0x0d4422, 0x2a8a50];
            // Spawn orbs near the four corners, away from the card area
            const cornerSeeds = [
                [0.08, 0.08], [0.92, 0.12], [0.05, 0.88],
            ];
            for (let i = 0; i < 3; i++) {
                const g = new PIXI.Graphics();
                const radius = 120 + i * 60;
                // Draw soft radial gradient orb using concentric circles
                for (let r = radius; r > 0; r -= 4) {
                    const alpha = (1 - r / radius) * 0.025;
                    g.beginFill(orbColors[i], alpha);
                    g.drawCircle(0, 0, r);
                    g.endFill();
                }
                g.x = cornerSeeds[i][0] * window.innerWidth + (Math.random() - 0.5) * 60;
                g.y = cornerSeeds[i][1] * window.innerHeight + (Math.random() - 0.5) * 60;
                const orb = {
                    gfx: g,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: (Math.random() - 0.5) * 0.15,
                };
                orbs.push(orb);
                ambientContainer.addChild(g);
            }

            // === Win burst overlay container (hidden by default) ===
            const winContainer = new PIXI.Container();
            winContainer.visible = false;
            app.stage.addChild(winContainer);

            // Ticker for ambient animation
            app.ticker.add(() => {
                const w = app.screen.width;
                const h = app.screen.height;
                // Card area safe zone: center 60% x 65% of screen
                const zoneX = w * 0.2, zoneY = h * 0.18;
                const zoneW = w * 0.6, zoneH = h * 0.65;
                const zoneCX = zoneX + zoneW / 2;
                const zoneCY = zoneY + zoneH / 2;
                const repelRadius = Math.min(w, h) * 0.38;

                for (const orb of orbs) {
                    orb.gfx.x += orb.vx;
                    orb.gfx.y += orb.vy;
                    // Bounce off edges
                    if (orb.gfx.x < -150 || orb.gfx.x > w + 150) orb.vx *= -1;
                    if (orb.gfx.y < -150 || orb.gfx.y > h + 150) orb.vy *= -1;
                    // Repel from card area center to keep orbs in periphery
                    const dx = orb.gfx.x - zoneCX;
                    const dy = orb.gfx.y - zoneCY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < repelRadius && dist > 0) {
                        const force = (repelRadius - dist) / repelRadius * 0.06;
                        orb.vx += (dx / dist) * force;
                        orb.vy += (dy / dist) * force;
                        // Clamp max speed
                        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
                        if (speed > 0.3) { orb.vx = orb.vx / speed * 0.3; orb.vy = orb.vy / speed * 0.3; }
                    }
                }
            });

            // Public API: trigger win burst
            function triggerWinBurst() {
                winContainer.visible = true;
                winContainer.removeChildren();

                const cx = app.screen.width / 2;
                const cy = app.screen.height / 2;

                // Draw 3 expanding golden rings
                for (let ring = 0; ring < 3; ring++) {
                    const g = new PIXI.Graphics();
                    g.lineStyle(2, 0xffd700, 0.7);
                    g.drawCircle(0, 0, 10);
                    g.x = cx;
                    g.y = cy;
                    winContainer.addChild(g);

                    const delay = ring * 200;
                    let elapsed = -delay;
                    const duration = 1200;

                    const ticker = (delta) => {
                        elapsed += app.ticker.deltaMS;
                        if (elapsed < 0) return;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        g.scale.set(1 + eased * 14);
                        g.alpha = (1 - progress) * 0.6;
                        if (progress >= 1) {
                            app.ticker.remove(ticker);
                            g.destroy();
                            if (winContainer.children.length === 0) winContainer.visible = false;
                        }
                    };
                    app.ticker.add(ticker);
                }
            }

            // Pause when tab hidden
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) app.ticker.stop();
                else app.ticker.start();
            });

            return { ready: true, triggerWinBurst, destroy: () => { app.destroy(true); } };
        })();

        // === Screen Shake ===
        function screenShake(intensity = 5, duration = 300, decay = 0.92) {
            const board = document.getElementById('board');
            if (!board) return;
            const origTransition = board.style.transition;
            board.style.transition = 'none';
            let mag = intensity;
            const start = performance.now();
            const shake = (now) => {
                const elapsed = now - start;
                if (elapsed > duration || mag < 0.5) {
                    board.style.transform = '';
                    board.style.transition = origTransition;
                    return;
                }
                const dx = (Math.random() - 0.5) * 2 * mag;
                const dy = (Math.random() - 0.5) * 2 * mag;
                board.style.transform = `translate(${dx}px, ${dy}px)`;
                mag *= decay;
                requestAnimationFrame(shake);
            };
            requestAnimationFrame(shake);
        }

        // Shake presets
        const SHAKE = {
            light: () => screenShake(3, 200),
            medium: () => screenShake(5, 300),
            heavy: () => screenShake(8, 400),
            dramatic: () => screenShake(12, 600, 0.9)
        };

        // === Arc Animation Helper ===
        function animateCardArc(el, fromRect, toRect, opts = {}) {
            const duration = opts.duration || getDelay(500);
            const arcHeight = opts.arcHeight || 60;
            const rotEnd = opts.rotate || 20;
            const scaleEnd = opts.scale || 0.5;
            const midX = (fromRect.left + toRect.left) / 2;
            const midY = Math.min(fromRect.top, toRect.top) - arcHeight;
            return el.animate([
                { left: fromRect.left + 'px', top: fromRect.top + 'px', transform: 'scale(1) rotate(0deg)', opacity: 1 },
                { left: midX + 'px', top: midY + 'px', transform: `scale(${(1 + scaleEnd) / 2}) rotate(${rotEnd / 2}deg)`, opacity: 1, offset: 0.45 },
                { left: toRect.left + 'px', top: toRect.top + 'px', transform: `scale(${scaleEnd}) rotate(${rotEnd}deg)`, opacity: 0 }
            ], { duration, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
        }

        // === Count Up Animation ===
        function animateCountUp(el, target, duration = 800) {
            const start = performance.now();
            const numTarget = parseInt(target) || 0;
            const update = (now) => {
                const t = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(numTarget * eased);
                if (t < 1) requestAnimationFrame(update);
                else el.textContent = target;
            };
            requestAnimationFrame(update);
        }

        // === Play Chord ===
        function playChord(freqs, durationMs = 100, volume = 0.035, startAt = 0) {
            freqs.forEach(f => playTone(f, durationMs, volume, startAt));
        }

        // === Show Gold Flash (Sum=29 rare jackpot overlay) ===
        function showGoldFlash() {
            const el = document.createElement('div');
            el.style.cssText = 'position:fixed;inset:0;background:rgba(255,215,0,0);pointer-events:none;z-index:9989;transition:background 80ms ease';
            document.body.appendChild(el);
            requestAnimationFrame(() => {
                el.style.background = 'rgba(255,215,0,0.28)';
                setTimeout(() => {
                    el.style.transition = 'background 200ms ease';
                    el.style.background = 'rgba(255,215,0,0)';
                    setTimeout(() => el.remove(), 220);
                }, 80);
            });
        }

        // === Show Clear Flash ===
        function showClearFlash(opts = {}) {
            const flash = document.createElement('div');
            flash.className = 'clear-flash' + (opts.orange ? ' orange' : '');
            flash.style.setProperty('--flash-intensity', String(opts.intensity || 0.15));
            flash.style.background = opts.color || (opts.orange ? '#ff8c00' : 'white');
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), getDelay(250));
        }

        // === Show Number Flyout ===
        function showNumberFlyout(cards, colEl, sum, isError = false) {
            if (!colEl) return;
            const footer = document.getElementById('footer');
            const footerTop = footer ? footer.getBoundingClientRect().top : window.innerHeight * 0.85;
            const targetX = window.innerWidth / 2;
            const targetY = footerTop - 36;
            const errClass = isError ? ' error' : '';
            const flyouts = [];

            cards.forEach((card, i) => {
                const cardEl = colEl.children[card.idx];
                if (!cardEl) return;
                const r = cardEl.getBoundingClientRect();
                const el = document.createElement('div');
                el.className = 'number-flyout' + errClass;
                el.textContent = card.data.val;
                el.style.left = (r.left + r.width / 2) + 'px';
                el.style.top = (r.top + r.height / 2) + 'px';
                document.body.appendChild(el);
                flyouts.push(el);

                el.animate([
                    { left: (r.left + r.width / 2) + 'px', top: (r.top + r.height / 2) + 'px', opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                    { left: targetX + 'px', top: targetY + 'px', opacity: 1, transform: 'translate(-50%, -50%) scale(1.3)' }
                ], { duration: getDelay(350), delay: getDelay(50), easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
            });

            setTimeout(() => {
                flyouts.forEach(f => f.remove());
                const result = document.createElement('div');
                result.className = 'number-result' + errClass;
                result.textContent = isError ? `= ${sum} ✗` : `= ${sum}`;
                result.style.left = targetX + 'px';
                result.style.top = targetY + 'px';
                document.body.appendChild(result);
                setTimeout(() => result.remove(), getDelay(800));
            }, getDelay(400));
        }

        // === Show Win Ring ===
        function showWinRing(x, y) {
            const ring = document.createElement('div');
            ring.className = 'win-ring';
            ring.style.left = x + 'px';
            ring.style.top = y + 'px';
            document.body.appendChild(ring);
            setTimeout(() => ring.remove(), getDelay(800));
        }

        // 共用 compressor，防止多音同時播放破音
        let _compressor = null;
        function getCompressor() {
            if (!audioCtx) return null;
            if (!_compressor) {
                _compressor = audioCtx.createDynamicsCompressor();
                _compressor.threshold.value = -18;
                _compressor.knee.value = 8;
                _compressor.ratio.value = 4;
                _compressor.attack.value = 0.003;
                _compressor.release.value = 0.15;
                _compressor.connect(audioCtx.destination);
            }
            return _compressor;
        }

        // === Real Sound System ===
        const _soundCache = {};
        const _soundBasePath = (() => {
            if (window.Capacitor) return '/sounds/';
            return './sounds/';
        })();

        async function _loadSound(name) {
            if (_soundCache[name]) return _soundCache[name];
            if (!audioCtx) {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (!Ctx) return null;
                audioCtx = new Ctx();
            }
            for (const ext of ['mp3', 'ogg', 'wav']) {
                try {
                    const res = await fetch(_soundBasePath + name + '.' + ext);
                    if (!res.ok) continue;
                    const buf = await res.arrayBuffer();
                    const decoded = await audioCtx.decodeAudioData(buf);
                    _soundCache[name] = decoded;
                    return decoded;
                } catch (_) {}
            }
            return null;
        }

        function preloadSounds() {
            ['deal','clear9','clear19','clear29','error','win','recycle','deadlock','cardSelect1','cardSelect2','cardSelect3','cardSelectOK','cardSelectFail'].forEach(n => _loadSound(n).catch(()=>{}));
        }

        function playRealSound(name, volume = 1.0) {
            if (!settings.sound) return false;
            const buf = _soundCache[name];
            if (!buf || !audioCtx) return false;
            if (audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
            const src = audioCtx.createBufferSource();
            src.buffer = buf;
            const gain = audioCtx.createGain();
            gain.gain.value = volume;
            src.connect(gain);
            gain.connect(getCompressor() || audioCtx.destination);
            src.start();
            return true;
        }
        // === End Real Sound System ===

        function playTone(freq = 440, durationMs = 80, volume = 0.04, startAt = 0, waveform = 'triangle') {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            if (!audioCtx) audioCtx = new Ctx();
            if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => { });

            const now = audioCtx.currentTime + startAt;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.value = freq;
            osc.type = waveform;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(volume * 2.8, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
            osc.connect(gain);
            gain.connect(getCompressor() || audioCtx.destination);
            osc.start(now);
            osc.stop(now + durationMs / 1000 + 0.02);
        }

        // ── Background Music Engine ──────────────────────────────────
        const BGM = (() => {
            const TRACKS = {
                g2: _soundBasePath + 'bgm_g2.mp3',
                g3: _soundBasePath + 'bgm_g3.mp3',
            };
            const TARGET_VOL = 0.45;
            let currentTrack = 'g2';
            let activeEl = null;
            let running = false;

            function makeEl(track) {
                const el = new Audio(TRACKS[track] || TRACKS.g2);
                el.loop = true;
                el.volume = 0;
                return el;
            }

            function fadeIn(el) {
                el.play().catch(() => {});
                let v = el.volume;
                const timer = setInterval(() => {
                    v = Math.min(v + 0.05, TARGET_VOL);
                    el.volume = v;
                    if (v >= TARGET_VOL) clearInterval(timer);
                }, 80);
            }

            function fadeOut(el, cb) {
                let v = el.volume;
                const timer = setInterval(() => {
                    v = Math.max(v - 0.05, 0);
                    el.volume = v;
                    if (v <= 0) {
                        clearInterval(timer);
                        el.pause();
                        if (cb) cb();
                    }
                }, 80);
            }

            return {
                start() {
                    if (running) return;
                    running = true;
                    if (!activeEl) activeEl = makeEl(currentTrack);
                    fadeIn(activeEl);
                },
                stop() {
                    if (!running) return;
                    running = false;
                    if (activeEl) fadeOut(activeEl, () => { activeEl = null; });
                },
                sync(enabled) {
                    if (enabled) this.start(); else this.stop();
                },
                setTrack(track) {
                    if (track === currentTrack) return;
                    currentTrack = track;
                    if (!running) return;
                    const old = activeEl;
                    activeEl = makeEl(track);
                    fadeIn(activeEl);
                    if (old) fadeOut(old);
                }
            };
        })();
        // ── End Background Music Engine ──────────────────────────────

        function playSound(name, opts = {}) {
            if (!settings.sound) return;
            try {
                const sum = opts.sum || 0;
                const cmb = opts.combo || 0;

                if (name === 'deal') {
                    if (playRealSound('deal', 0.9)) return;
                    playTone(430, 50, 0.03);
                } else if (name === 'clear') {
                    if (sum >= 29) {
                        if (playRealSound('clear29', 1.0)) return;
                        playChord([330, 550, 740, 880], 160, 0.045);
                        playChord([330, 550, 740], 120, 0.028, 0.14);
                        playChord([440, 660],       90,  0.016, 0.30);
                        playChord([550],            70,  0.009, 0.48);
                    } else if (sum >= 19) {
                        if (playRealSound('clear19', 0.9)) return;
                        playChord([440, 660, 880], 100, 0.04);
                    } else {
                        if (playRealSound('clear9', 0.85)) return;
                        playTone(550, 70, 0.04); playTone(740, 80, 0.04, 0.06); playTone(880, 60, 0.03, 0.1);
                    }
                    // Combo pitch rise
                    if (cmb >= 5) {
                        const base = 600 + cmb * 40;
                        playTone(base, 60, 0.025, 0.15);
                        playTone(base + 100, 60, 0.025, 0.22);
                        playTone(base + 200, 60, 0.025, 0.29);
                    } else if (cmb >= 2) {
                        playTone(500 + cmb * 40, 50, 0.02, 0.12);
                    }
                } else if (name === 'error') {
                    if (playRealSound('error', 0.8)) return;
                    playTone(210, 110, 0.045);
                } else if (name === 'hint') {
                    playTone(360, 60, 0.025);
                } else if (name === 'recycle') {
                    if (playRealSound('recycle', 0.85)) return;
                    playTone(300, 70, 0.03); playTone(420, 70, 0.03, 0.08);
                } else if (name === 'win') {
                    if (playRealSound('win', 1.0)) return;
                    playTone(520, 100, 0.05);
                    playTone(660, 100, 0.05, 0.1);
                    playTone(780, 100, 0.05, 0.2);
                    playTone(1040, 150, 0.05, 0.3);
                    playChord([520, 780, 1040], 300, 0.03, 0.45);
                } else if (name === 'deadlock') {
                    if (playRealSound('deadlock', 0.8)) return;
                    playTone(250, 120, 0.04);
                } else if (name === 'columnClear') {
                    if (playRealSound('clear9', 0.75)) return;
                    playTone(660, 80, 0.04, 0, 'sine');
                    playTone(880, 100, 0.045, 0.08);
                } else if (name === 'cardSelect1') {
                    if (playRealSound('cardSelect1', 0.7)) return;
                    playTone(420, 45, 0.04, 0, 'sine');
                } else if (name === 'cardSelect2') {
                    if (playRealSound('cardSelect2', 0.75)) return;
                    playTone(620, 45, 0.044, 0, 'sine');
                } else if (name === 'cardSelect3OK') {
                    // 第三張可消除時，使用專用高音成功音色
                    if (playRealSound('cardSelectOK', 0.8)) return;
                    playTone(920, 50, 0.048, 0, 'sine');
                    playTone(1180, 60, 0.042, 0.05, 'sine');
                } else if (name === 'cardSelect3Fail') {
                    if (playRealSound('cardSelectFail', 0.75)) return;
                    playTone(360, 55, 0.044, 0, 'sine');
                    playTone(260, 70, 0.04, 0.06, 'sine');
                } else if (name === 'cardDeselect') {
                    playTone(420, 35, 0.03, 0, 'sine');
                }
            } catch (_) { }
        }

        function toLocalDateKey(date = new Date()) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }

        function addDays(dateKey, deltaDays) {
            if (!dateKey) return '';
            const date = new Date(`${dateKey}T00:00:00`);
            date.setDate(date.getDate() + deltaDays);
            return toLocalDateKey(date);
        }

        function loadDailyChallengeState() {
            try {
                const raw = localStorage.getItem(DAILY_CHALLENGE_KEY);
                if (!raw) return { lastCompletedDate: '' };
                const parsed = JSON.parse(raw);
                return { lastCompletedDate: typeof parsed.lastCompletedDate === 'string' ? parsed.lastCompletedDate : '' };
            } catch (_) {
                return { lastCompletedDate: '' };
            }
        }

        function saveDailyChallengeState(state) {
            try {
                localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(state));
            } catch (_) { }
        }

        function markDailyChallengeWin() {
            if (gameMode !== 'daily') return '';
            const today = toLocalDateKey();
            const state = loadDailyChallengeState();
            if (state.lastCompletedDate === today) {
                return t('daily.already_completed', { date: today });
            }
            state.lastCompletedDate = today;
            saveDailyChallengeState(state);
            return t('daily.first_complete', { date: today });
        }

        async function submitDailyScoreIfNeeded(current, kind = 'lucky3') {
            if (gameMode !== 'daily') {
                lastDailyRankText = '';
                return '';
            }
            const bridge = window.lucky3Firebase;
            if (!bridge || !bridge.submitDailyScore) {
                lastDailyRankText = '';
                return '';
            }
            try {
                const playerName = (localStorage.getItem('lucky3-player-name') || '').trim();
                const result = await bridge.submitDailyScore({
                    dateKey: toLocalDateKey(),
                    bestTimeMs: current.elapsedSec * 1000,
                    moves: current.moveCount,
                    maxCombo: current.maxCombo,
                    resultKind: kind,
                    ...(playerName ? { name: playerName } : {})
                });

                if (result.status === 'created') {
                    lastDailyRankText = t('rank.created');
                } else if (result.status === 'updated') {
                    lastDailyRankText = t('rank.updated');
                } else if (result.status === 'skipped') {
                    lastDailyRankText = t('rank.skipped');
                } else {
                    lastDailyRankText = '';
                }
                return lastDailyRankText;
            } catch (e) {
                console.error('submit daily score failed:', e);
                lastDailyRankText = t('rank.failed');
                return lastDailyRankText;
            }
        }

        function loadAchievements() {
            try {
                const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
                if (!raw) return { ...DEFAULT_ACHIEVEMENTS };
                const parsed = JSON.parse(raw);
                const sw = parsed.suitWins || {};
                return {
                    wins: Number.isInteger(parsed.wins) ? parsed.wins : 0,
                    zeroClearWins: Number.isInteger(parsed.zeroClearWins) ? parsed.zeroClearWins : 0,
                    streakShield: Number.isInteger(parsed.streakShield) ? parsed.streakShield : 0,
                    maxCombo: Number.isInteger(parsed.maxCombo) ? parsed.maxCombo : 0,
                    bestMoves: Number.isInteger(parsed.bestMoves) ? parsed.bestMoves : null,
                    bestTimeSec: Number.isInteger(parsed.bestTimeSec) ? parsed.bestTimeSec : null,
                    currentStreak: Number.isInteger(parsed.currentStreak) ? parsed.currentStreak : 0,
                    longestStreak: Number.isInteger(parsed.longestStreak) ? parsed.longestStreak : 0,
                    lastWinDate: typeof parsed.lastWinDate === 'string' ? parsed.lastWinDate : '',
                    noUndoWins: Number.isInteger(parsed.noUndoWins) ? parsed.noUndoWins : 0,
                    suitWins: { spade: !!sw.spade, heart: !!sw.heart, diamond: !!sw.diamond, club: !!sw.club },
                    fullSweepWins: Number.isInteger(parsed.fullSweepWins) ? parsed.fullSweepWins : 0,
                    dailyWins: Number.isInteger(parsed.dailyWins) ? parsed.dailyWins : 0,
                    comboGameWins: Number.isInteger(parsed.comboGameWins) ? parsed.comboGameWins : 0
                };
            } catch (_) {
                return { ...DEFAULT_ACHIEVEMENTS };
            }
        }

        function saveAchievements() {
            try {
                localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
            } catch (_) { }
        }

        function getUnlockedBadgeTitles() {
            return achievementBadgeRows().filter((r) => r.ok).map((r) => r.title);
        }

        function spawnAchievementBurst() {
            const count = 14;
            for (let i = 0; i < count; i++) {
                const dot = document.createElement('div');
                dot.className = 'achievement-burst';
                dot.style.setProperty('--tx', `${(Math.random() - 0.5) * 240}px`);
                dot.style.setProperty('--ty', `${(Math.random() - 0.5) * 180}px`);
                document.body.appendChild(dot);
                setTimeout(() => dot.remove(), getDelay(900));
            }
        }

        function showAchievementToast(title, body) {
            const wrap = document.getElementById('achievement-toast-wrap');
            if (!wrap) return;
            const el = document.createElement('div');
            el.className = 'achievement-toast';
            el.innerHTML = `<div class="achievement-toast-title">${title}</div><div class="achievement-toast-body">${body}</div>`;
            wrap.appendChild(el);
            setTimeout(() => el.remove(), getDelay(2700));
        }

        function updateAchievementsOnWin(current, kind = 'lucky3') {
            const beforeUnlocked = new Set(getUnlockedBadgeTitles());
            let streakNotice = '';
            achievements.wins += 1;
            // Trigger in-app review prompt after 3rd win, once only
            if (achievements.wins === 3 && !localStorage.getItem('lucky3-review-done')) {
                localStorage.setItem('lucky3-review-done', '1');
                setTimeout(async () => {
                    try {
                        if (window.Capacitor?.isNativePlatform?.() && window.Capacitor?.Plugins?.InAppReview) {
                            await window.Capacitor.Plugins.InAppReview.requestReview();
                        }
                    } catch(e) { /* silent */ }
                }, 4500);
            }
            achievements.maxCombo = Math.max(achievements.maxCombo, current.maxCombo);
            achievements.bestMoves = achievements.bestMoves == null ? current.moveCount : Math.min(achievements.bestMoves, current.moveCount);
            achievements.bestTimeSec = achievements.bestTimeSec == null ? current.elapsedSec : Math.min(achievements.bestTimeSec, current.elapsedSec);

            // New achievements
            if (!undoUsedThisGame) achievements.noUndoWins += 1;
            if (gameMode === 'daily') achievements.dailyWins += 1;
            if (columnsClearedSet.size >= 4) achievements.fullSweepWins += 1;
            if (comboEventsThisGame >= 3) achievements.comboGameWins += 1;
            if (winCardSuit && winCardSuit !== 'void') achievements.suitWins[winCardSuit] = true;

            const today = toLocalDateKey();
            if (achievements.lastWinDate !== today) {
                const yesterday = addDays(today, -1);
                const twoDaysAgo = addDays(today, -2);
                if (achievements.lastWinDate === yesterday) {
                    achievements.currentStreak += 1;
                } else if (achievements.streakShield > 0 && achievements.lastWinDate === twoDaysAgo) {
                    achievements.streakShield = Math.max(0, achievements.streakShield - 1);
                    achievements.currentStreak += 1;
                    streakNotice = t('streak.notice_saved');
                    showAchievementToast(t('streak.toast_saved_title'), t('streak.toast_saved_body'));
                } else {
                    achievements.currentStreak = 1;
                }
                achievements.longestStreak = Math.max(achievements.longestStreak, achievements.currentStreak);
                achievements.lastWinDate = today;
            }

            if (achievements.currentStreak >= 5 && achievements.streakShield < 1) {
                achievements.streakShield = 1;
                if (!streakNotice) streakNotice = t('streak.notice_charged');
                showAchievementToast(t('streak.toast_charged_title'), t('streak.toast_charged_body'));
            }

            const afterUnlocked = new Set(getUnlockedBadgeTitles());
            const unlockedNow = [...afterUnlocked].filter((x) => !beforeUnlocked.has(x));
            if (unlockedNow.length > 0) {
                unlockedNow.forEach((title) => {
                    showAchievementToast(t('achievement.unlock_prefix', { title }), t('achievement.unlock_body'));
                });
                spawnAchievementBurst();
                playSound('hint');
            }

            // Record today's first win suit for calendar
            const wh = loadWinHistory();
            if (!wh[today]) {
                wh[today] = (winCardSuit || '');
                saveWinHistory(wh);
            }

            saveAchievements();
            syncCardBackUnlocks({ showToast: true });
            return { streakNotice };
        }

        function achievementBadgeRows() {
            const rows = [
                {
                    icon: '⚡',
                    title: t('achievement.badge.combo.title'),
                    ok: achievements.maxCombo >= 5,
                    text: achievements.maxCombo >= 5
                        ? t('achievement.badge.combo.done', { value: achievements.maxCombo })
                        : t('achievement.badge.combo.progress', { value: achievements.maxCombo }),
                    progress: Math.min(1, achievements.maxCombo / 5)
                },
                {
                    icon: '👟',
                    title: t('achievement.badge.moves.title'),
                    ok: achievements.bestMoves != null && achievements.bestMoves <= 18,
                    text: achievements.bestMoves == null
                        ? t('achievement.badge.moves.no_run')
                        : t('achievement.badge.moves.progress', { value: achievements.bestMoves }),
                    progress: achievements.bestMoves == null ? 0 : Math.min(1, 18 / achievements.bestMoves)
                },
                {
                    icon: '🔥',
                    title: t('achievement.badge.streak.title'),
                    ok: achievements.longestStreak >= 7,
                    text: t('achievement.badge.streak.progress', { value: achievements.longestStreak }),
                    progress: Math.min(1, achievements.longestStreak / 7)
                },
                {
                    icon: '🏆',
                    title: t('achievement.badge.wins.title'),
                    ok: achievements.wins >= 10,
                    text: t('achievement.badge.wins.progress', { value: achievements.wins }),
                    progress: Math.min(1, achievements.wins / 10)
                },
                {
                    icon: '🚫',
                    title: t('achievement.badge.ironwill.title'),
                    ok: achievements.noUndoWins >= 1,
                    text: achievements.noUndoWins >= 1
                        ? t('achievement.badge.ironwill.done', { value: achievements.noUndoWins })
                        : t('achievement.badge.ironwill.progress'),
                    progress: Math.min(1, achievements.noUndoWins)
                },
                {
                    icon: '🃏',
                    title: t('achievement.badge.suitcollector.title'),
                    ok: Object.values(achievements.suitWins).every(Boolean),
                    text: t('achievement.badge.suitcollector.progress', { value: Object.values(achievements.suitWins).filter(Boolean).length }),
                    progress: Object.values(achievements.suitWins).filter(Boolean).length / 4
                },
                {
                    icon: '♠',
                    title: t('achievement.badge.luckydraw.title'),
                    ok: achievements.suitWins.spade === true,
                    text: achievements.suitWins.spade
                        ? t('achievement.badge.luckydraw.done')
                        : t('achievement.badge.luckydraw.progress'),
                    progress: achievements.suitWins.spade ? 1 : 0
                },
                {
                    icon: '🧹',
                    title: t('achievement.badge.fullsweep.title'),
                    ok: achievements.fullSweepWins >= 1,
                    text: achievements.fullSweepWins >= 1
                        ? t('achievement.badge.fullsweep.done', { value: achievements.fullSweepWins })
                        : t('achievement.badge.fullsweep.progress'),
                    progress: Math.min(1, achievements.fullSweepWins)
                },
                {
                    icon: '📅',
                    title: t('achievement.badge.dailyregular.title'),
                    ok: achievements.dailyWins >= 7,
                    text: t('achievement.badge.dailyregular.progress', { value: achievements.dailyWins }),
                    progress: Math.min(1, achievements.dailyWins / 7)
                },
                {
                    icon: '👑',
                    title: t('achievement.badge.grandmaster.title'),
                    ok: achievements.wins >= 50,
                    text: t('achievement.badge.grandmaster.progress', { value: achievements.wins }),
                    progress: Math.min(1, achievements.wins / 50)
                },
                {
                    icon: '⚡⚡',
                    title: t('achievement.badge.chainreaction.title'),
                    ok: achievements.comboGameWins >= 1,
                    text: achievements.comboGameWins >= 1
                        ? t('achievement.badge.chainreaction.done', { value: achievements.comboGameWins })
                        : t('achievement.badge.chainreaction.progress'),
                    progress: Math.min(1, achievements.comboGameWins)
                }
            ];
            return rows;
        }

        function buildStreakCalendar() {
            const today = toLocalDateKey();
            const wh = loadWinHistory();
            const suitEmoji = { spade: '♠', heart: '♥', diamond: '♦', club: '♣', void: '✨', '': '' };

            // Build current month's dates
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

            let html = `<div class="streak-calendar">
                <div class="streak-calendar-title">${monthName}</div>
                <div class="streak-cal-grid">`;

            // Weekday headers
            ['S','M','T','W','T','F','S'].forEach(d => {
                html += `<div class="streak-cal-weekday">${d}</div>`;
            });

            // Empty cells before first day
            for (let i = 0; i < firstDay; i++) {
                html += `<div class="streak-cal-day" style="opacity:0;pointer-events:none"></div>`;
            }

            // Days
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                const isToday = dateStr === today;
                const suit = wh[dateStr];
                const hasWin = !!suit;
                const emoji = suitEmoji[suit] || '';
                html += `<div class="streak-cal-day${hasWin ? ' has-win' : ''}${isToday ? ' today' : ''}">
                    ${emoji ? `<span class="cal-suit">${emoji}</span>` : ''}
                    <span class="cal-num">${d}</span>
                </div>`;
            }

            html += `</div></div>`;
            return html;
        }

        function renderAchievements() {
            const grid = document.getElementById('achievement-grid');
            const badges = document.getElementById('achievement-badges');
            if (!grid || !badges) return;

            grid.innerHTML = `
                <div class="achievement-stat"><div class="achievement-stat-label">🏆 ${t('achievement.stat.wins')}</div><div class="achievement-stat-value">${achievements.wins}</div></div>
                <div class="achievement-stat"><div class="achievement-stat-label">🛡️ ${t('achievement.stat.streak_shield')}</div><div class="achievement-stat-value">${achievements.streakShield > 0 ? t('achievement.stat.shield_ready') : t('achievement.stat.shield_empty')}</div></div>
                <div class="achievement-stat"><div class="achievement-stat-label">🔥 ${t('achievement.stat.current_streak')}</div><div class="achievement-stat-value">${t('common.days', { value: achievements.currentStreak })}</div></div>
                <div class="achievement-stat"><div class="achievement-stat-label">📈 ${t('achievement.stat.longest_streak')}</div><div class="achievement-stat-value">${t('common.days', { value: achievements.longestStreak })}</div></div>
                <div class="achievement-stat"><div class="achievement-stat-label">⚡ ${t('achievement.stat.max_combo')}</div><div class="achievement-stat-value">${achievements.maxCombo}</div></div>
                <div class="achievement-stat"><div class="achievement-stat-label">👣 ${t('achievement.stat.best_moves')}</div><div class="achievement-stat-value">${achievements.bestMoves == null ? '-' : achievements.bestMoves}</div></div>
                <div class="achievement-stat"><div class="achievement-stat-label">⏱️ ${t('achievement.stat.best_time')}</div><div class="achievement-stat-value">${achievements.bestTimeSec == null ? '-' : formatTime(achievements.bestTimeSec)}</div></div>
            `;

            // Insert streak calendar
            const gridEl = document.getElementById('achievement-grid');
            if (gridEl) {
                gridEl.insertAdjacentHTML('afterbegin', buildStreakCalendar());
            }

            badges.innerHTML = achievementBadgeRows().map((b) => `
                <div class="achievement-badge ${b.ok ? 'unlocked' : ''}">
                    <div class="badge-header">
                        <span class="badge-icon">${b.icon}</span>
                        <div class="badge-info">
                            <strong class="badge-title">${b.ok ? '✅' : '⬜'} ${b.title}</strong>
                            <span class="badge-text">${b.text}</span>
                        </div>
                    </div>
                    <div class="achievement-progress"><div class="achievement-progress-fill" style="width:${Math.max(0, Math.min(100, Math.round((b.progress || 0) * 100)))}%"></div></div>
                </div>
            `).join('');
        }

        function openAchievements() {
            renderAchievements();
            const overlay = document.getElementById('achievement-overlay');
            if (!overlay) return;
            overlay.classList.add('show');
        }

        function closeAchievements() {
            const overlay = document.getElementById('achievement-overlay');
            if (!overlay) return;
            overlay.classList.remove('show');
        }

        function onAchievementOverlayClick(event) {
            if (event.target && event.target.id === 'achievement-overlay') {
                closeAchievements();
            }
        }

        function openAchievementsFromSettings() {
            toggleSettings(false);
            openAchievements();
        }

        function openRules() {
            toggleSettings(false);
            const overlay = document.getElementById('rules-overlay');
            if (overlay) overlay.classList.add('show');
        }

        function closeRules() {
            const overlay = document.getElementById('rules-overlay');
            if (overlay) overlay.classList.remove('show');
        }

        function onRulesOverlayClick(event) {
            if (event.target && event.target.id === 'rules-overlay') closeRules();
        }

        function escHtml(s) {
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        function renderDailyLeaderboard(rows, uid, dateKey) {
            const list = document.getElementById('leaderboard-list');
            const subtitle = document.getElementById('leaderboard-subtitle');
            if (!list || !subtitle) return;

            subtitle.innerText = t('leaderboard.subtitle_date', { date: dateKey, top: rows.length || 20 });

            if (!rows || rows.length === 0) {
                list.innerHTML = `<div class="leaderboard-empty">${t('leaderboard.empty')}</div>`;
                return;
            }

            let myRank = null;
            list.innerHTML = rows.map((row) => {
                const mine = uid && row.uid === uid;
                if (mine) myRank = row.rank;
                return `
                    <div class="leaderboard-row ${mine ? 'mine' : ''}">
                        <div class="leaderboard-rank">#${escHtml(row.rank)}</div>
                        <div class="leaderboard-user">${mine ? t('leaderboard.you') : escHtml(row.name)}</div>
                        <div class="leaderboard-time">${escHtml(formatMs(row.bestTimeMs))}</div>
                        <div class="leaderboard-moves">${t('leaderboard.moves', { moves: escHtml(row.moves) })}</div>
                    </div>
                `;
            }).join('');

            if (myRank) subtitle.innerText = t('leaderboard.subtitle_my_rank', { date: dateKey, rank: myRank });
        }

        async function openDailyLeaderboard() {
            toggleSettings(false);
            const overlay = document.getElementById('leaderboard-overlay');
            const list = document.getElementById('leaderboard-list');
            const subtitle = document.getElementById('leaderboard-subtitle');
            if (!overlay || !list || !subtitle) return;

            overlay.classList.add('show');
            subtitle.innerText = t('leaderboard.loading');
            list.innerHTML = `<div class="leaderboard-empty">${t('leaderboard.loading_rows')}</div>`;

            const bridge = window.lucky3Firebase;
            if (!bridge || !bridge.loadDailyLeaderboard) {
                subtitle.innerText = t('leaderboard.firebase_not_ready');
                list.innerHTML = `<div class="leaderboard-empty">${t('leaderboard.firebase_retry')}</div>`;
                return;
            }

            try {
                const dateKey = toLocalDateKey();
                const payload = await bridge.loadDailyLeaderboard(dateKey, 20);
                renderDailyLeaderboard(payload.rows, payload.uid, dateKey);
            } catch (e) {
                console.error('load leaderboard failed:', e);
                subtitle.innerText = t('leaderboard.load_failed');
                list.innerHTML = `<div class="leaderboard-empty">${t('leaderboard.load_failed_body')}</div>`;
            }
        }

        function closeDailyLeaderboard() {
            const overlay = document.getElementById('leaderboard-overlay');
            if (!overlay) return;
            overlay.classList.remove('show');
        }

        function onLeaderboardOverlayClick(event) {
            if (event.target && event.target.id === 'leaderboard-overlay') closeDailyLeaderboard();
        }

        // --- 初始化與重置 ---
        function init(forceNew = false, options = {}) {
            // 強制解鎖狀態
            isBusy = false;
            endChallengeMode();
            const targetMode = options.mode === 'daily' ? 'daily' : 'normal';

            // 清除 render cache，確保新遊戲完整重建
            Object.keys(_slotRenderCache).forEach(k => delete _slotRenderCache[k]);
            _slotCompressHidden = {};
            // 清除 board DOM（新遊戲需要完整重建）
            const boardEl = document.getElementById('board');
            if (boardEl) boardEl.innerHTML = '';

            // 清除 UI
            const fxLayer = document.getElementById('fx-layer');
            if (fxLayer) fxLayer.innerHTML = '';
            ParticleSystem.clear();
            ParticleSystem.resize();
            const bigMsg = document.querySelector('.big-msg');
            if (bigMsg) bigMsg.remove();
            const winOverlay = document.getElementById('win-overlay');
            if (winOverlay) winOverlay.remove();
            const deadlockOverlay = document.getElementById('deadlock-overlay');
            if (deadlockOverlay) deadlockOverlay.remove();
            const rewindOverlay = document.getElementById('rewind-overlay');
            if (rewindOverlay) rewindOverlay.remove();
            clearRewindFocus();
            clearRewindLockTag();
            clearAutoEliminateTimer();
            if (comboFocusTimer) {
                clearTimeout(comboFocusTimer);
                comboFocusTimer = null;
            }
            comboFocusActive = false;
            document.body.classList.remove('major-combo-active');
            if (winInterval) clearInterval(winInterval);
            if (magicMomentTimer) {
                clearTimeout(magicMomentTimer);
                magicMomentTimer = null;
            }
            magicMomentActive = false;
            document.body.classList.remove('magic-moment-active');

            if (!forceNew && targetMode === 'normal' && loadGameState()) {
                if (hasWon) {
                    // 遊戲已完成但未點「再來一局」就離開 — 清除紀錄，直接開新局
                    try { localStorage.removeItem(GAME_STATE_KEY); } catch (_) {}
                } else {
                    setUndoEnabled(historyStack.length > 0);
                    updateHeaderModeTag();
                    render();
                    updateDiscard();
                    const deadlocked = checkDeadlock();
                    if (deadlocked && historyStack.length === 0) {
                        // 避免回到無法操作的舊死局，直接重開一局。
                        try { localStorage.removeItem(GAME_STATE_KEY); } catch (_) { }
                        init(true, { mode: targetMode });
                        return;
                    }
                    return;
                }
            }

            // 重置資料
            deck = [];
            discardPile = [];
            clearedGroups = [];
            if (tutorialDeckMode) {
                deck = buildTutorialDeck();
                gameMode = 'normal';
                currentSeed = null;
                currentDifficultyTag = 'TUTORIAL';
            } else {
                gameMode = targetMode;
                const pickedSeed = gameMode === 'daily' ? pickDailySeed() : pickCuratedSeed();
                if (pickedSeed == null) {
                    const fullDeck = [];
                    suits.forEach(s => ranks.forEach(r => {
                        fullDeck.push({ rank: r, suit: s, val: r === 'A' ? 1 : parseInt(r), color: s === '♥' || s === '♦' ? 'red' : 'black' });
                    }));
                    shuffleInPlace(fullDeck);
                    deck = fullDeck;
                    currentSeed = null;
                    currentDifficultyTag = 'RANDOM';
                } else {
                    deck = buildSeededDeck(pickedSeed);
                    currentSeed = pickedSeed;
                }
                BGM.setTrack(currentGameGrade);
            }

            slots = [
                { id: 0, cards: [], active: true },
                { id: 1, cards: [], active: true },
                { id: 2, cards: [], active: true },
                { id: 3, cards: [], active: true }
            ];

            selected = [];
            nextSlotIndex = tutorialDeckMode ? 3 : 0;
            historyStack = [];
            combo = 0;
            lastCleared = null;
            startTime = Date.now();
            moveCount = 0;
            clearMoveCount = 0;
            dailyUndoCount = 0;
            updateUndoCountDisplay();
            maxCombo = 0;
            hasWon = false;
            deadlockShown = false;
            winCardSuit = '';
            undoUsedThisGame = false;
            columnsCleared = 0;
            columnsClearedSet = new Set();
            dealCount = 0;
            recycleCount = 0;
            columnClearEvents = [];
            comboEventsThisGame = 0;

            // 重新渲染
            setUndoEnabled(false);
            updateHeaderModeTag();
            syncBoardScale();
            render();
            updateDiscard();
            const tutorialOpeningQueue = tutorialDeckMode ? [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2] : null;
            resetDealHapticCount();
            // 靈牌儀式：非教學模式才顯示
            const epoch = ++_gameEpoch;
            const omenPromise = (!tutorialDeckMode && deck.length > 0)
                ? showOmenCard(deck[deck.length - 1]?.suit || null)
                : Promise.resolve();
            omenPromise.then(() => {
                if (epoch !== _gameEpoch) return;
                return runOpeningDealAnimation(3, tutorialOpeningQueue, epoch);
            }).then(() => {
                if (epoch !== _gameEpoch) return;
                updateDiscard();
                saveGameState();
                if (!hasWon) checkDeadlock();
                if (tutorialDeckMode) {
                    startTutorial(true);
                    tutorialDeckMode = false;
                } else {
                    startTutorial(false);
                }
            });
        }

        function resetGame() {
            openRestartConfirm();
        }

        function resetGameFromSettings() {
            toggleSettings(false);
            resetGame();
        }

        function openRestartConfirm() {
            const overlay = document.getElementById('restart-overlay');
            if (!overlay) return;
            overlay.classList.add('show');
        }

        function closeRestartConfirm() {
            const overlay = document.getElementById('restart-overlay');
            if (!overlay) return;
            overlay.classList.remove('show');
        }

        function onRestartOverlayClick(event) {
            if (event.target && event.target.id === 'restart-overlay') {
                closeRestartConfirm();
            }
        }

        function confirmRestartGame() {
            closeRestartConfirm();
            maybeShowInterstitial(() => {
                init(true, { mode: gameMode });
            });
        }

        // 計時器 (只需在頁面加載時執行一次 setInterval)
        setInterval(() => {
            const sec = Math.floor((Date.now() - startTime) / 1000);
            const m = Math.floor(sec / 60).toString().padStart(2, '0');
            const s = (sec % 60).toString().padStart(2, '0');
            const timerEl = document.getElementById('timer');
            if (timerEl) timerEl.innerText = `${m}:${s}`;
        }, 1000);

        // --- 核心渲染 ---
        function render() {
            const board = document.getElementById('board');
            syncBoardScale();

            const threeReady = selected.length === 3;
            const activeSlots = slots.filter(s => s.active);
            const activeIds = new Set(activeSlots.map(s => s.id));

            // 移除已不存在的 column（slot 變 inactive）
            [...board.children].forEach(child => {
                const id = parseInt(child.id?.replace('col-', ''));
                if (!isNaN(id) && !activeIds.has(id)) {
                    delete _slotRenderCache[id];
                    child.remove();
                }
            });

            activeSlots.forEach(slot => {
                // 計算 fingerprint：牌組內容 + 選取狀態 + threeReady
                const selInSlot = selected.filter(s => s.slotId === slot.id);
                const fp = slot.cards.map(c => c.rank + c.suit).join(',')
                    + '|' + selInSlot.map(s => s.idx).sort((a, b) => a - b).join(',')
                    + '|' + threeReady;

                const existingCol = document.getElementById(`col-${slot.id}`);
                if (existingCol && _slotRenderCache[slot.id] === fp) {
                    return; // 內容未變，保留現有 DOM，避免不必要的重繪
                }
                _slotRenderCache[slot.id] = fp;

                const col = document.createElement('div');
                col.className = 'column'; col.id = `col-${slot.id}`;
                const COMPRESS_TOP = 3;
                // Dynamic threshold: how many cards fit in the visible board area
                const _cs = getComputedStyle(document.documentElement);
                const _cardH = parseFloat(_cs.getPropertyValue('--card-h')) || 119;
                const _gap   = parseFloat(_cs.getPropertyValue('--fixed-gap')) || -86;
                const _stepH = _cardH + _gap;
                const _vw = window.innerWidth || 360, _vh = window.innerHeight || 640;
                const _isSidebar = _vw > _vh && _vh < 500 && _vw >= 640;
                // Use board.clientHeight directly so ad-banner, safe-areas and all
                // UI chrome are automatically accounted for — no guesswork needed.
                let _availH;
                if (board.clientHeight > 100) {
                    _availH = board.clientHeight - 10; // 10px safety margin
                } else {
                    const _headerH = document.getElementById('header')?.offsetHeight || 60;
                    const _footerH = _isSidebar ? 0 : (document.getElementById('footer')?.offsetHeight || 90);
                    const _adH = document.getElementById('ad-banner')?.offsetHeight || 0;
                    _availH = _vh - _headerH - _footerH - _adH - 20;
                }
                const COMPRESS_THRESH = Math.max(6, Math.floor((_availH - _cardH) / _stepH) + 1);
                const total = slot.cards.length;
                // Suppress compression when 3 cards are selected (player needs to see all)
                const doCompress = total > COMPRESS_THRESH && !threeReady;

                // Wave-compression: badge fixed at first-compression value;
                // new cards accumulate visibly at bottom until screen fills again.
                let COMPRESS_BOT = 3;
                if (doCompress) {
                    const maxBot = Math.max(3, COMPRESS_THRESH - COMPRESS_TOP);
                    if (_slotCompressHidden[slot.id] === undefined) {
                        // First wave: fix hidden count now
                        _slotCompressHidden[slot.id] = total - COMPRESS_TOP - 3;
                    }
                    COMPRESS_BOT = total - COMPRESS_TOP - _slotCompressHidden[slot.id];
                    if (COMPRESS_BOT > maxBot || COMPRESS_BOT < 3) {
                        // Screen full again → start next wave
                        _slotCompressHidden[slot.id] = total - COMPRESS_TOP - 3;
                        COMPRESS_BOT = 3;
                    }
                } else {
                    // Column no longer compressed → clear wave state
                    delete _slotCompressHidden[slot.id];
                }

                const midStart = COMPRESS_TOP;
                const midEnd = total - COMPRESS_BOT; // exclusive
                const selectionFeedback = getSelectionFeedback(slot);
                slot.cards.forEach((card, idx) => {
                    const div = document.createElement('div');
                    const selObj = selected.find(s => s.slotId === slot.id && s.idx === idx);
                    const readyClass = selObj && selectionFeedback.isComplete ? ' selected-ready' : '';
                    const stateClass = selObj && selectionFeedback.isComplete
                        ? (selectionFeedback.isValidComplete ? ' selected-magnetic' : ' selected-invalid-pending')
                        : (!selObj && selectionFeedback.candidateIndices.has(idx) ? ' candidate-soft' : '');
                    const suitClass = card.suit === '♥' ? 'suit-heart' : card.suit === '♦' ? 'suit-diamond' : card.suit === '♠' ? 'suit-spade' : 'suit-club';
                    div.className = `card ${card.color} ${suitClass} ${selObj ? 'selected' : ''}${readyClass}${stateClass}`;
                    div.dataset.cardKey = `${card.rank}${card.suit}`;
                    div.dataset.slotId = String(slot.id);
                    div.dataset.cardIdx = String(idx);
                    if (doCompress && idx >= midStart && idx < midEnd) {
                        div.className += ' stack-middle';
                    }
                    // Keep original stack order stable even when selected.
                    div.style.zIndex = idx;
                    div.innerHTML = `
    <div class="card-corner card-tl">
        <div class="card-rank">${card.rank}</div>
        <div class="card-suit-small">${card.suit}</div>
    </div>
    <div class="card-center-suit">${card.suit}</div>
    <div class="card-corner card-br">
        <div class="card-rank">${card.rank}</div>
        <div class="card-suit-small">${card.suit}</div>
    </div>`;
                    div.onclick = () => {
                        if (isBusy) return;
                        const sIdx = selected.findIndex(s => s.slotId === slot.id && s.idx === idx);
                        if (sIdx > -1) {
                            selected.splice(sIdx, 1);
                            playSound('cardDeselect');
                        } else {
                            if (!isSelectableCardIndex(slot.cards.length, idx)) {
                                triggerHaptic(30);
                                div.classList.add('invalid-flash');
                                setTimeout(() => div.classList.remove('invalid-flash'), getDelay(320));
                                return;
                            }
                            if (selected.length > 0 && selected[0].slotId !== slot.id) selected = [];
                            if (selected.length < 3) {
                                selected.push({ slotId: slot.id, idx });
                                pulseCardSelect(div); // 選牌光圈脈衝
                                const newCount = selected.length;
                                if (newCount === 3) {
                                    // 判斷第3張是否合法（位置 + 數字）
                                    const selSlot = slots.find(s => s.id === selected[0].slotId);
                                    const selIndices = selected.map(s => s.idx).sort((a, b) => a - b);
                                    const posOk = isLegalSelectionPosition(selSlot.cards.length, selIndices);
                                    const sum = selected.reduce((a, c) => a + selSlot.cards[c.idx].val, 0);
                                    const sumOk = [9, 19, 29].includes(sum);
                                    playSound(posOk && sumOk ? 'cardSelect3OK' : 'cardSelect3Fail');
                                } else {
                                    playSound(newCount === 1 ? 'cardSelect1' : 'cardSelect2');
                                }
                            }
                        }

                        if (tutorial.active && tutorial.step === 2 && selected.length === 3) {
                            const picked = selected.map(s => s.idx);
                            const legal = isLegalSelectionPosition(slot.cards.length, picked);
                            if (legal) {
                                onTutorialEvent('selected_three');
                            } else {
                                showTutorialRuleHint();
                                setTimeout(() => {
                                    selected = [];
                                    render();
                                }, getDelay(650));
                                render();
                                return;
                            }
                        }
                        render();
                    };
                    col.appendChild(div);
                    if (doCompress && idx === COMPRESS_TOP - 1) {
                        const badge = document.createElement('div');
                        badge.className = 'stack-count-badge';
                        const midCount = midEnd - midStart;
                        badge.textContent = `+${midCount}`;
                        col.appendChild(badge);
                    }
                });

                // 用 replaceChild 取代舊 column，board 永遠不會出現空白瞬間
                if (existingCol) {
                    board.replaceChild(col, existingCol);
                } else {
                    board.appendChild(col);
                }
            });

            document.getElementById('deck-num').innerText = deck.length;

            // Auto-eliminate scheduling
            if (selected.length === 3 && !isBusy) {
                scheduleAutoEliminate();
            } else {
                clearAutoEliminateTimer();
            }

            updateSumBar();
        }

        // --- 選牌加總顯示 ---
        function updateSumBar() {
            const bar = document.getElementById('sum-bar');
            if (!bar) return;
            if (!settings.sumHelper || selected.length === 0) {
                bar.classList.add('hidden');
                return;
            }
            const slot = slots.find(s => s.id === selected[0].slotId);
            if (!slot) { bar.classList.add('hidden'); return; }

            const vals = selected.map(s => slot.cards[s.idx]?.val ?? 0);
            const sum = vals.reduce((a, b) => a + b, 0);
            const isComplete = selected.length === 3;
            const isOk = isComplete && [9, 19, 29].includes(sum);

            const parts = vals.map(v => `<span>${v}</span>`).join(' <span style="opacity:.6">+</span> ');
            const totalClass = isComplete ? (isOk ? 'sum-ok' : 'sum-fail') : 'sum-total';
            const totalStr = selected.length > 1
                ? ` <span style="opacity:.5">=</span> <span class="${totalClass}">${sum}</span>`
                : '';

            bar.innerHTML = parts + totalStr;
            bar.classList.remove('hidden');
        }

        // --- 特效邏輯 ---
        function showColumnClearFX(slotId) {
            const colEl = document.getElementById(`col-${slotId}`);
            if (!colEl) return;
            triggerHaptic([100, 40, 100, 40, 100]);
            playSound('columnClear');
            const beam = document.createElement('div'); beam.className = 'column-beam';
            colEl.appendChild(beam);
            const text = document.createElement('div'); text.className = 'column-clear-text';
            text.innerText = t('column.clear'); colEl.appendChild(text);
            const rect = colEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
            const _colTheme = getCurrentTheme();
            const _colTCfg = _colTheme ? THEME_CONFIGS[_colTheme] : null;
            if (_colTheme && _colTCfg) {
                spawnThemeParticles(_colTheme, 'columnClear', cx, cy);
                playThemeSound(_colTheme, 'columnClear');
                const beamColor = _colTCfg.columnClear?.beamColor || 'rgba(255,255,255,0.8)';
                const glowColor = _colTCfg.columnClear?.glowColor || 'rgba(255,215,0,0.3)';
                beam.style.setProperty('--cb-beam-color', beamColor);
                colEl.style.setProperty('--cb-glow-color', glowColor);
            } else {
                ParticleSystem.emit('confetti', cx, cy, { count: 25 });
            }
            showWinRing(cx, cy);
            colEl.classList.add('column-cleared-glow');
            setTimeout(() => colEl.classList.remove('column-cleared-glow'), getDelay(1500));
            setTimeout(() => { if (beam.parentNode) beam.remove(); if (text.parentNode) text.remove(); }, getDelay(1200));
        }

        function getCurrentTheme() {
            return getCurrentCardbackConfig().theme || null;
        }

        function spawnThemeParticles(theme, trigger, x, y, opts = {}) {
            if (shouldMinimizeMotion()) return;
            const cfg = THEME_CONFIGS[theme];
            if (!cfg) return;
            const tCfg = cfg[trigger] || cfg.clear || {};
            const multiplier = opts.multiplier || 1.0;
            const speedBoost = opts.speedBoost || 1.0;

            let colorStart = cfg.colors[0];
            let colorEnd   = cfg.colors[1];
            if (theme === 'LIFE_SUIT' && opts.suitColors) {
                colorStart = opts.suitColors[0];
                colorEnd   = opts.suitColors[1];
            }

            const count   = Math.round((tCfg.count || 12) * multiplier);
            const speedArr = tCfg.speed  || [2.0, 4.0];
            const lifeArr  = tCfg.life   || [600, 900];
            const [rsMin, rsMax] = cfg.rotSpeed || [0, 0];
            const airDrift = cfg.airDrift || 0;
            const isUpward = cfg.speedDir === 'up';
            const sizeDecay = cfg.sizeDecay || 0.97;

            for (let i = 0; i < count; i++) {
                const speed = (speedArr[0] + Math.random() * (speedArr[1] - speedArr[0])) * speedBoost;
                let vx, vy;
                if (isUpward) {
                    const a = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.7);
                    vx = Math.cos(a) * speed + (Math.random() - 0.5) * airDrift * 20;
                    vy = Math.sin(a) * speed;
                } else {
                    const a = Math.random() * Math.PI * 2;
                    vx = Math.cos(a) * speed + (Math.random() - 0.5) * airDrift * 20;
                    vy = Math.sin(a) * speed;
                }
                const life = lifeArr[0] + Math.random() * (lifeArr[1] - lifeArr[0]);
                ParticleSystem.spawnRaw({
                    x, y, vx, vy,
                    gravity: cfg.gravity,
                    friction: cfg.friction,
                    life, maxLife: life,
                    size: 2.5 + Math.random() * 2.5,
                    sizeDecay,
                    colorStart, colorEnd,
                    shape: cfg.shape,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: rsMin + Math.random() * (rsMax - rsMin),
                    alpha: 1, trail: []
                });
            }

            // FORGE accent sparks
            if (theme.startsWith('FORGE')) {
                const sparkCount = tCfg.sparkCount || 0;
                for (let s = 0; s < sparkCount; s++) {
                    const a = Math.random() * Math.PI * 2;
                    const sp = 3 + Math.random() * 4;
                    const sLife = 100 + Math.random() * 80;
                    ParticleSystem.spawnRaw({
                        x, y,
                        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                        gravity: 0.35, friction: 0.95,
                        life: sLife, maxLife: sLife,
                        size: 1.5, sizeDecay: 0.88,
                        colorStart: '#FFFFFF', colorEnd: '#FF8C00',
                        shape: 'star',
                        rotation: 0, rotSpeed: 0,
                        alpha: 1, trail: []
                    });
                }
            }
        }

        function playThemeSound(theme, trigger) {
            if (!settings.sound) return;
            const isCol = (trigger === 'columnClear');
            const isMiiPeek = (trigger === 'miiPeek');
            const vM = isCol ? 1.4 : (isMiiPeek ? 0.9 : 1.0);
            const dM = isCol ? 1.8 : (isMiiPeek ? 0.75 : 1.0);
            if (theme === 'CRYSTAL') {
                playTone(1500, Math.round(80 * dM), 0.03 * vM, 0, 'sine');
                if (isCol) playTone(1800, 60, 0.018, 0.06, 'sine');
                if (isMiiPeek) playTone(1240, 40, 0.02, 0.02, 'sine');
            } else if (theme === 'EMBER_BRIGHT') {
                playTone(600, Math.round(30 * dM), 0.05 * vM, 0, 'sawtooth');
                if (isMiiPeek) playTone(760, 30, 0.02, 0.02, 'triangle');
            } else if (theme === 'EMBER_DARK') {
                playTone(400, Math.round(40 * dM), 0.05 * vM, 0, 'sawtooth');
                if (isMiiPeek) playTone(560, 36, 0.02, 0.02, 'triangle');
            } else if (theme.startsWith('FORGE')) {
                playTone(180, Math.round(50 * dM), 0.07 * vM, 0, 'triangle');
                if (isCol) playTone(120, 80, 0.04, 0.05, 'triangle');
                if (isMiiPeek) playTone(240, 34, 0.03, 0.03, 'triangle');
            } else if (theme.startsWith('VOID')) {
                playTone(200, Math.round(200 * dM), 0.02 * vM, 0, 'sine');
                if (isMiiPeek) playTone(320, 70, 0.012, 0.02, 'sine');
            } else if (theme.startsWith('ARC')) {
                playTone(2000, Math.round(20 * dM), 0.04 * vM, 0, 'square');
                playTone(800, Math.round(15 * dM), 0.02 * vM, 0.02, 'square');
                if (isMiiPeek) playTone(2400, 12, 0.018, 0.01, 'square');
            } else if (theme === 'LIFE_FOREST') {
                playTone(800, Math.round(60 * dM), 0.025 * vM, 0, 'sine');
                playTone(1000, Math.round(50 * dM), 0.018 * vM, 0.04, 'sine');
                if (isMiiPeek) playTone(680, 34, 0.012, 0.01, 'sine');
            } else if (theme === 'LIFE_FESTIVE') {
                playTone(900, Math.round(70 * dM), 0.025 * vM, 0, 'sine');
                playTone(1200, Math.round(60 * dM), 0.018 * vM, 0.05, 'sine');
                if (isMiiPeek) playTone(720, 28, 0.016, 0.01, 'sine');
            } else if (theme === 'LIFE_SUIT') {
                playTone(850, Math.round(80 * dM), 0.028 * vM, 0, 'triangle');
                if (isMiiPeek) playTone(680, 28, 0.013, 0.01, 'triangle');
            } else if (theme === 'LIFE_STELLAR') {
                playTone(1100, Math.round(100 * dM), 0.02 * vM, 0, 'sine');
                playTone(1400, Math.round(80 * dM), 0.014 * vM, 0.08, 'sine');
                if (isMiiPeek) playTone(980, 36, 0.012, 0.01, 'sine');
            }
        }

        function showMiiFX(colEl, incomingCard, existingCards) {
            if (!colEl) return;
            const existing = colEl.querySelector('.mii-text');
            if (existing) existing.remove();
            const cbCfg = getCurrentCardbackConfig();
            const defaultTextStyle = cbCfg.miiText?.default || {};
            const chanceTextStyle = cbCfg.miiText?.chance || defaultTextStyle;
            const haptic = cbCfg.hapticProfile || {};

            // 判斷落下後是否能湊出有效消除
            const canClear = Array.isArray(existingCards) && incomingCard
                ? getLegalClearIndices([...existingCards, incomingCard]).length > 0
                : false;

            const text = document.createElement('div');
            text.className = 'mii-text';
            text.dataset.miiProfile = cbCfg.miiFxProfile || 'CRYSTAL';

            if (canClear) {
                text.innerText = '✦ ' + t('mii.chance');
                text.style.setProperty('--mii-text-color', chanceTextStyle.color || '#4eff91');
                text.style.setProperty('--mii-text-border', chanceTextStyle.border || 'rgba(0, 255, 120, 0.55)');
                text.style.setProperty('--mii-text-bg', chanceTextStyle.bg || 'rgba(0, 30, 12, 0.92)');
                triggerHaptic(haptic.chance || [20, 20, 60]);
            } else {
                text.innerText = t('mii.peeking');
                text.style.setProperty('--mii-text-color', defaultTextStyle.color || '#fff');
                text.style.setProperty('--mii-text-border', defaultTextStyle.border || 'rgba(255, 255, 255, 0.4)');
                text.style.setProperty('--mii-text-bg', defaultTextStyle.bg || 'rgba(16, 18, 20, 0.88)');
                triggerHaptic(haptic.peek || [25, 30, 25]);
            }

            colEl.appendChild(text);
            setTimeout(() => { if (text.parentNode) text.remove(); }, getDelay(1100));
        }

        function getDealTargetTop(colEl, existingCount) {
            if (!colEl || existingCount <= 0) return colEl?.getBoundingClientRect().top ?? 0;

            const cardEls = Array.from(colEl.querySelectorAll('.card'));
            const safeCount = Math.min(existingCount, cardEls.length);
            if (safeCount <= 0) return colEl.getBoundingClientRect().top;

            const lastCardEl = cardEls[safeCount - 1];
            if (!lastCardEl) return colEl.getBoundingClientRect().top;

            const lastRect = lastCardEl.getBoundingClientRect();
            let step = 0;

            const getConfiguredGapPx = () => {
                const colGapRaw = getComputedStyle(colEl).getPropertyValue('--col-gap').trim();
                if (colGapRaw.endsWith('px')) {
                    const val = parseFloat(colGapRaw);
                    if (Number.isFinite(val)) return val;
                }
                if (colGapRaw.endsWith('vw')) {
                    const val = parseFloat(colGapRaw);
                    if (Number.isFinite(val)) return (window.innerWidth * val) / 100;
                }
                if (window.innerWidth >= 450) return -85;
                const raw = getComputedStyle(document.documentElement).getPropertyValue('--fixed-gap').trim();
                if (raw.endsWith('vw')) {
                    const val = parseFloat(raw);
                    if (Number.isFinite(val)) return (window.innerWidth * val) / 100;
                }
                if (raw.endsWith('px')) {
                    const val = parseFloat(raw);
                    if (Number.isFinite(val)) return val;
                }
                return 0;
            };

            if (safeCount >= 2) {
                const prevCardEl = cardEls[safeCount - 2];
                if (prevCardEl) {
                    const prevRect = prevCardEl.getBoundingClientRect();
                    step = lastRect.top - prevRect.top;
                }
            }

            // existingCount===1 時，唯一那張仍是 :last-child，margin-bottom 會是 0，
            // 會導致第二張落點算太低；改用配置間距計算，避免第二張卡頓。
            if (!Number.isFinite(step) || step === 0 || safeCount === 1) {
                step = lastRect.height + getConfiguredGapPx();
            }

            return lastRect.top + step;
        }

        function popNewlyDealtCard(slotId) {
            const colEl = document.getElementById(`col-${slotId}`);
            if (!colEl || colEl.children.length === 0) return;
            const newest = colEl.children[colEl.children.length - 1];
            newest.classList.add('mii-land-pop');
            setTimeout(() => newest.classList.remove('mii-land-pop'), getDelay(460));
        }

        function getLegalClearIndices(cards) {
            const len = cards.length;
            if (len < 3) return [];

            const candidates = [
                [len - 3, len - 2, len - 1],
                [0, len - 2, len - 1],
                [0, 1, len - 1]
            ];
            const uniqueCandidates = [...new Set(candidates.map(c => JSON.stringify(c)))].map(x => JSON.parse(x));
            return uniqueCandidates.filter((indices) => {
                if (indices.some(i => i < 0 || i >= len)) return false;
                const sum = indices.reduce((acc, i) => acc + cards[i].val, 0);
                return [9, 19, 29].includes(sum);
            });
        }

        function findFirstLegalClearMove() {
            for (const slot of slots) {
                if (!slot.active) continue;
                const legal = getLegalClearIndices(slot.cards);
                if (legal.length === 0) continue;
                const indices = legal[0];
                const sum = indices.reduce((acc, i) => acc + slot.cards[i].val, 0);
                return { slotId: slot.id, indices: [...indices].sort((a, b) => a - b), sum };
            }
            return null;
        }

        function findUpperGreedyClearMove() {
            for (const slot of slots) {
                if (!slot.active) continue;
                const len = slot.cards.length;
                if (len < 3) continue;
                const candidates = [
                    [0, 1, len - 1],
                    [0, len - 2, len - 1],
                    [len - 3, len - 2, len - 1]
                ];
                for (const indices of candidates) {
                    if (indices.some(i => i < 0 || i >= len)) continue;
                    const sum = indices.reduce((acc, i) => acc + slot.cards[i].val, 0);
                    if ([9, 19, 29].includes(sum)) {
                        return { slotId: slot.id, indices: [...indices].sort((a, b) => a - b), sum };
                    }
                }
            }
            return null;
        }

        function performClearMove(slotId, sortedIndices, sum) {
            const slot = slots.find(s => s.id === slotId);
            if (!slot) return Promise.resolve(false);

            const currentCards = [...slot.cards];
            if (sortedIndices.some(i => i < 0 || i >= currentCards.length)) return Promise.resolve(false);

            isBusy = true;
            const colEl = document.getElementById(`col-${slotId}`);
            const clearedObjects = sortedIndices.map(idx => ({ idx: idx, data: { ...currentCards[idx] } }));
            historyStack.push({ type: 'clear', slotId, cards: clearedObjects, prevLast: lastCleared, comboBefore: combo });
            setUndoEnabled(true);
            const destRect = document.getElementById('discard-pile').getBoundingClientRect();
            const discardCx = destRect.left + destRect.width / 2;
            const discardCy = destRect.top + destRect.height / 2;
            const reducedMotion = shouldMinimizeMotion();
            lastCleared = currentCards[sortedIndices[sortedIndices.length - 1]];

            // --- Phase 1: Windup ---
            if (colEl) {
                sortedIndices.forEach(idx => {
                    const cardEl = colEl.children[idx];
                    if (cardEl) {
                        cardEl.classList.add('clear-phase-windup');
                        cardEl.style.transition = `all ${getDelay(CLEAR_MOVE_PHASES.WINDUP)}ms ease`;
                        if (sum >= 19) {
                            cardEl.style.transform = 'scale(1.12)';
                            cardEl.style.filter = 'brightness(1.6)';
                        } else {
                            cardEl.style.transform = 'scale(1.06)';
                            cardEl.style.filter = 'brightness(1.3)';
                        }
                    }
                });
            }

            // Flash + shake: restrained for sum=9, dramatic for 19/29
            if (sum >= 29) {
                showClearFlash({ orange: true, intensity: 0.2 });
                SHAKE.medium();
                showGoldFlash();
            } else if (sum >= 19) {
                showClearFlash({ intensity: 0.1 });
                SHAKE.light();
            } else {
                // sum=9: subtle — no shake, no flash, gentle haptic
                // keep the phase quiet; impact haptic comes with the actual clear
            }

            // --- Phase 2: Number flyout ---
            setTimeout(() => {
                showNumberFlyout(clearedObjects, colEl, sum);
            }, getDelay(CLEAR_MOVE_PHASES.FLYOUT));

            // --- Phase 3: Impact + discard arc ---
            return new Promise((resolve) => {
                setTimeout(() => {
                    const comboAfterClear = combo + 1;
                    const impactHaptic = sum >= 29 ? [80, 30, 80, 30, 80] : sum >= 19 ? [50, 30, 50] : 30;
                    triggerHaptic(impactHaptic);
                    playSound('clear', { sum, combo: comboAfterClear });

                    if (colEl) {
                        sortedIndices.forEach(idx => {
                            const cardEl = colEl.children[idx];
                            if (cardEl) {
                                cardEl.classList.remove('clear-phase-windup');
                                cardEl.classList.add('clear-phase-impact');
                                cardEl.classList.add('is-fading');
                            }
                        });
                    }

                    if (colEl) {
                        sortedIndices.forEach((idx, i) => {
                            const cardEl = colEl.children[idx];
                            if (!cardEl) return;
                            const fly = createFly(currentCards[idx], cardEl.getBoundingClientRect());
                            // Shatter particles at takeoff
                            const r = cardEl.getBoundingClientRect();
                            ParticleSystem.emit('shatter', r.left + r.width / 2, r.top + r.height / 2, {
                                count: reducedMotion ? 2 : (sum >= 29 ? 12 : sum >= 19 ? 8 : 5)
                            });
                            ParticleSystem.emit('discardTrail', r.left + r.width / 2, r.top + r.height / 2, {
                                tx: discardCx,
                                ty: discardCy,
                                count: reducedMotion ? 2 : 4
                            });

                            const arcAnim = animateCardArc(fly, r, destRect, {
                                duration: getDelay(CLEAR_MOVE_PHASES.WINDUP * 2),
                                arcHeight: 50 + Math.random() * 30,
                                rotate: 15 + Math.random() * 15,
                                scale: 0.4
                            });
                            arcAnim.onfinish = () => fly.remove();
                        });
                    }

                    // Sum-specific burst particles — theme-aware
                    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
                    const _clearTheme = getCurrentTheme();
                    if (_clearTheme) {
                        // Get suit colors for LIFE_SUIT theme
                        let _suitColors = null;
                        if (_clearTheme === 'LIFE_SUIT') {
                            const _firstCard = slot.cards[sortedIndices[0]];
                            _suitColors = SUIT_THEME_COLORS[_firstCard?.suit] || null;
                        }
                        // Scale particle count by sum tier
                        const _sumMult = sum >= 29 ? 1.5 : sum >= 19 ? 1.0 : 0.65;
                        const _cxArr = sortedIndices.map(idx => {
                            const el = colEl?.children[idx];
                            if (!el) return cx;
                            const r = el.getBoundingClientRect();
                            return r.left + r.width / 2;
                        });
                        const _cy2 = (() => {
                            const el = colEl?.children[sortedIndices[0]];
                            if (!el) return cy;
                            const r = el.getBoundingClientRect();
                            return r.top + r.height / 2;
                        })();
                        // Emit from each card position
                        _cxArr.forEach(_cx2 => {
                            spawnThemeParticles(_clearTheme, 'clear', _cx2, _cy2, {
                                multiplier: _sumMult,
                                suitColors: _suitColors
                            });
                        });
                        playThemeSound(_clearTheme, 'clear');
                        if (sum >= 29) showClearFlash({ orange: true, intensity: 0.12 });
                    } else {
                        if (sum >= 29) {
                            ParticleSystem.emit('fireworks', cx, cy, { count: 35 });
                            showClearFlash({ orange: true, intensity: 0.15 });
                        } else if (sum >= 19) {
                            ParticleSystem.emit('burst', cx, cy, { count: 18, colorStart: '#ffd700', colorEnd: '#cc8800' });
                        }
                    }
                    // sum=9: no center burst — only shatter at card position (already emitted above)

                    const recycled = sortedIndices.map(i => slot.cards[i]);
                    discardPile.push(...recycled);
                    clearedGroups.push([...recycled]);
                    sortedIndices.slice().sort((a, b) => b - a).forEach(i => slot.cards.splice(i, 1));
                    combo = comboAfterClear;
                    selected = [];
                    maxCombo = Math.max(maxCombo, combo);
                    if (currentChallengeId) updateChallengeHud();
                    moveCount++;
                    clearMoveCount++;
                    let colCleared = false;
                    if (slot.cards.length === 0) {
                        colCleared = true;
                        columnsCleared++;
                        columnsClearedSet.add(slotId);
                        columnClearEvents.push({
                            slotId,
                            dealCount,
                            moveCount,
                            elapsedSec: Math.floor((Date.now() - startTime) / 1000),
                        });
                        showColumnClearFX(slotId);
                    }

                    setTimeout(() => {
                        if (colCleared) slot.active = false;
                        render();
                        const nextColEl = document.getElementById(`col-${slotId}`);
                        if (nextColEl) {
                            nextColEl.querySelectorAll('.card').forEach((cardEl) => {
                                cardEl.classList.add('clear-phase-settle');
                                setTimeout(() => cardEl.classList.remove('clear-phase-settle'), getDelay(CLEAR_MOVE_PHASES.SETTLE));
                            });
                        }
                        updateDiscard(true);
                        showCombo(sum);
                        checkVictory();
                        isBusy = false;
                        if (!hasWon) checkDeadlock();
                        saveGameState();
                        resolve(true);
                    }, colCleared ? getDelay(CLEAR_MOVE_PHASES.SETTLE) : 0);
                }, getDelay(CLEAR_MOVE_PHASES.IMPACT));
            });
        }

        // --- 發牌與消除 ---
        async function dealOneCard() {
            const now = Date.now();
            if (isBusy || now < dealInputLockedUntil) return;
            dealInputLockedUntil = now + getDelay(180);
            clearHintHighlight();

            if (seedCheatMode && !tutorial.active) {
                const autoMove = findUpperGreedyClearMove();
                if (autoMove) {
                    await performClearMove(autoMove.slotId, autoMove.indices, autoMove.sum);
                    if (hasWon || isBusy) return;
                }
            } else if (developerMode && !tutorial.active) {
                const autoMove = findFirstLegalClearMove();
                if (autoMove) {
                    await performClearMove(autoMove.slotId, autoMove.indices, autoMove.sum);
                    if (hasWon || isBusy) return;
                }
            }

            // 如果牌庫空了，但回收區有牌，則進行回收
            if (deck.length === 0 && clearedGroups.length > 0) {
                recycleDeck();
                return;
            }

            if (deck.length === 0) {
                if (hasAnyLegalClear()) {
                    showHintHighlight();
                    return;
                }
                checkDeadlock();
                return;
            }

            // 有可消除組合時，按 DEAL 先提示，不直接發牌。
            if (hasAnyLegalClear()) {
                showHintHighlight();
                return;
            }

            // Deal時取消選取
            if (selected.length > 0) {
                selected = [];
                render();
            }

            const avail = slots.find((s, i) => slots[(nextSlotIndex + i) % 4].active);
            if (!avail) return;
            isBusy = true; combo = 0;
            const target = slots[(nextSlotIndex + slots.indexOf(avail)) % 4];
            const prevIdx = nextSlotIndex;
            nextSlotIndex = (slots.indexOf(target) + 1) % 4;

            const skippedLegalClear = hasAnyLegalClear();

            // Pre-check max-deals BEFORE mutating state — otherwise a fail leaves
            // historyStack/moveCount/challengeDealCount dirty without a card popped,
            // and a subsequent undo would push `undefined` into the deck (save killer).
            if (currentChallengeId) {
                const lvl = CHALLENGE_LEVELS.find(c => c.id === currentChallengeId);
                if (lvl && lvl.condition === 'max-deals' && challengeDealCount + 1 > lvl.target) {
                    isBusy = false;
                    showChallengeFailOverlay(
                        t('challenge.fail_title_default'),
                        t('challenge.fail_max_deals', { target: lvl.target })
                    );
                    return;
                }
            }

            historyStack.push({ type: 'deal', slotId: target.id, prevIdx, skippedLegalClear });
            setUndoEnabled(true);
            moveCount++;
            dealCount++;
            if (currentChallengeId) {
                challengeDealCount++;
                updateChallengeHud();
            }
            playSound('deal');
            updateDeckWarnState();
            onTutorialEvent('deal');

            const card = deck.pop();
            const isMiiMoment = settings.miiPeek && target.cards.length === 2;
            const fly = createFly(card, document.getElementById('deck-pile').getBoundingClientRect(), { hidden: isMiiMoment });
            render();
            const colEl = document.getElementById(`col-${target.id}`);
            const rect = colEl.getBoundingClientRect();
            const targetTop = getDealTargetTop(colEl, target.cards.length);

            requestAnimationFrame(() => {
                fly.style.left = rect.left + 'px';
                fly.style.top = targetTop + 'px';
            });

            if (isMiiMoment) {
                // 階段一：牌到位後，欄位亮起張力背光
                setTimeout(() => {
                    colEl.classList.add('mii-tension');
                }, getDelay(420));

                // 階段二：翻牌（face-down → 正面）
                setTimeout(() => {
                    revealFlyCard(fly, card);
                }, getDelay(820));

                // 階段三：翻完後才開始 hover 呼吸 + 顯示提示
                setTimeout(() => {
                    fly.classList.add('mii-peek');
                    showMiiFX(colEl, card, target.cards);
                }, getDelay(1160));

                // 階段四：落牌，依能否消除選擇粒子
                setTimeout(() => {
                    colEl.querySelector('.mii-text')?.remove();
                    colEl.classList.remove('mii-tension');
                    target.cards.push(card);
                    fly.remove();
                    render();
                    popNewlyDealtCard(target.id);
                    const canClear = getLegalClearIndices([...target.cards]).length > 0;
                    const fxX = rect.left + rect.width / 2;
                    const fxY = targetTop + 10;
                    const theme = getCurrentTheme();
                    if (theme) {
                        const suitColors = theme === 'LIFE_SUIT'
                            ? (SUIT_THEME_COLORS[card?.suit] || null)
                            : null;
                        spawnThemeParticles(theme, 'miiPeek', fxX, fxY, {
                            multiplier: canClear ? 1.08 : 0.82,
                            speedBoost: canClear ? 1.06 : 0.94,
                            suitColors,
                        });
                        playThemeSound(theme, 'miiPeek');
                    } else {
                        ParticleSystem.emit(
                            canClear ? 'burst' : 'dust',
                            fxX,
                            fxY,
                            canClear ? { count: 10, colorStart: '#4eff91', colorEnd: '#ffd700' } : {}
                        );
                    }
                    isBusy = false;
                    checkDeadlock();
                    saveGameState();
                }, getDelay(2200));
            } else {
                setTimeout(() => {
                    target.cards.push(card);
                    fly.remove();
                    render();
                    ParticleSystem.emit('dust', rect.left + rect.width / 2, targetTop + 10);
                    isBusy = false;
                    checkDeadlock();
                    saveGameState();
                }, getDelay(400));
            }
        }

        function recycleDeck() {
            if (isBusy || clearedGroups.length === 0) return;
            isBusy = true;
            recycleCount++;
            playSound('recycle');
            // 按消除組順序回收：第一組消除的牌回到牌堆最上方（最先被抽到）
            const groupsInReturnOrder = [];
            for (let i = clearedGroups.length - 1; i >= 0; i--) {
                groupsInReturnOrder.push([...clearedGroups[i]]);
            }
            const rebuiltDeck = [];
            groupsInReturnOrder.forEach((group) => rebuiltDeck.push(...group));
            const applyRecycleResult = () => {
                deck = rebuiltDeck;
                discardPile = [];
                clearedGroups = [];
                lastCleared = null;
                // 洗回後舊的 historyStack 已失效：clear 記錄對應的牌已回到 deck，
                // 若允許 undo 會把牌同時插回 slot 造成重複牌。
                historyStack = [];
                setUndoEnabled(false);

                render();
                updateDiscard();
                isBusy = false;
                checkDeadlock();
                saveGameState();
            };

            if (settings.recycleAnim) {
                animateRecycleReturn(groupsInReturnOrder).then(applyRecycleResult);
            } else {
                applyRecycleResult();
            }
        }

        function showNeedThreeHint(selectedCount) {
            const old = document.getElementById('need-three-tip');
            if (old) old.remove();

            const msg = document.createElement('div');
            msg.id = 'need-three-tip';
            msg.className = 'need-three-tip';
            msg.innerText = selectedCount === 2 ? t('hint.need_three_two') : t('hint.need_three_default');
            document.body.appendChild(msg);

            triggerHaptic([18, 24, 18]);
            playSound('hint');
            setTimeout(() => {
                if (msg.parentNode) msg.remove();
            }, getDelay(980));
        }

        function scheduleAutoEliminate() {
            if (autoEliminateTimer !== null) return; // already scheduled
            if (selected.length !== 3 || isBusy) return;
            const slot = slots.find((s) => s.id === selected[0]?.slotId);
            const feedback = slot ? getSelectionFeedback(slot) : null;
            const delay = shouldMinimizeMotion() ? 0 : getDelay(feedback?.isValidComplete ? 90 : 120);
            autoEliminateTimer = setTimeout(() => {
                autoEliminateTimer = null;
                attemptClear();
            }, delay);
        }

        function clearAutoEliminateTimer() {
            if (autoEliminateTimer !== null) {
                clearTimeout(autoEliminateTimer);
                autoEliminateTimer = null;
            }
        }

        async function attemptClear() {
            if (isBusy) return;
            clearHintHighlight();
            if (selected.length !== 3) {
                showNeedThreeHint(selected.length);
                return;
            }
            const slotId = selected[0].slotId; const slot = slots.find(s => s.id === slotId);
            if (!slot) return;
            const currentCards = [...slot.cards];
            const sortedIndices = selected.map(s => s.idx).sort((a, b) => a - b);
            const selectionFeedback = getSelectionFeedback(slot);

            if (selectionFeedback.isValidComplete) {
                onTutorialEvent('attempt_clear_success');
                await performClearMove(slotId, sortedIndices, selectionFeedback.sum);
            } else {
                combo = 0; triggerHaptic(100);
                playSound('error');
                const sum = selectionFeedback.sum;

                const errSlotId = selected[0]?.slotId;
                const colEl = errSlotId != null ? document.getElementById(`col-${errSlotId}`) : null;
                // Show error sum flyout
                const errCards = selected.map(s => ({ idx: s.idx, data: { ...currentCards[s.idx] } }));
                showNumberFlyout(errCards, colEl, sum, true);

                selected.forEach(s => {
                    const cardEl = colEl?.children?.[s.idx];
                    if (cardEl) cardEl.classList.add('invalid-flash');
                });

                setTimeout(() => {
                    selected = [];
                    render();
                    checkDeadlock();
                    saveGameState();
                }, getDelay(760));
            }
        }

        function performUndoStep({ animateButton = true, runDeadlockCheck = true, persistState = true, force = false } = {}) {
            if (historyStack.length === 0) return false;
            if (isBusy && !force) return false;
            const beforeRects = rewindSequenceActive ? captureCardRects() : null;

            // 按鈕旋轉動畫
            const btn = document.getElementById('btn-undo');
            if (animateButton && btn) {
                btn.classList.remove('undo-spinning');
                void btn.offsetWidth;
                btn.classList.add('undo-spinning');
                setTimeout(() => btn.classList.remove('undo-spinning'), 420);
            }

            undoUsedThisGame = true;
            const last = historyStack.pop(); combo = last.comboBefore || 0;
            moveCount = Math.max(0, moveCount - 1);
            if (gameMode === 'daily') { dailyUndoCount++; updateUndoCountDisplay(); }
            if (last.type === 'deal') {
                const s = slots.find(x => x.id === last.slotId);
                if (s.cards.length === 0) {
                    // Defensive: shouldn't happen, but pushing pop() of empty array would
                    // put `undefined` into deck and corrupt the save on next reload.
                    historyStack.push(last);
                    moveCount = Math.max(0, moveCount + 1);
                    return false;
                }
                deck.push(s.cards.pop()); nextSlotIndex = last.prevIdx;
                if (currentChallengeId) {
                    challengeDealCount = Math.max(0, challengeDealCount - 1);
                    updateChallengeHud();
                }
            } else {
                clearMoveCount = Math.max(0, clearMoveCount - 1);
                const s = slots.find(x => x.id === last.slotId); s.active = true;
                // 從回收堆移除最後三張牌
                discardPile.splice(-3);
                clearedGroups.pop();
                last.cards.sort((a, b) => a.idx - b.idx).forEach(c => s.cards.splice(c.idx, 0, c.data));
                lastCleared = last.prevLast;
            }
            selected = []; render(); updateDiscard();
            if (rewindSequenceActive && beforeRects) animateRewindCardMotion(beforeRects);

            // post-render 動畫
            if (!rewindSequenceActive) {
                if (last.type === 'deal') {
                    // 牌堆數字 bump
                    const deckNum = document.getElementById('deck-num');
                    if (deckNum) {
                        deckNum.classList.remove('undo-bump');
                        void deckNum.offsetWidth;
                        deckNum.classList.add('undo-bump');
                        setTimeout(() => deckNum.classList.remove('undo-bump'), 360);
                    }
                } else if (last.type === 'clear') {
                    // 復原的三張牌依序落入
                    const colEl = document.getElementById(`col-${last.slotId}`);
                    if (colEl) {
                        const restoredIdxs = last.cards.map(c => c.idx).sort((a, b) => a - b);
                        const cardEls = [...colEl.querySelectorAll('.card')];
                        restoredIdxs.forEach((ci, i) => {
                            const el = cardEls[ci];
                            if (!el) return;
                            el.style.animationDelay = `${i * 45}ms`;
                            el.classList.add('undo-card-return');
                            setTimeout(() => {
                                el.classList.remove('undo-card-return');
                                el.style.animationDelay = '';
                            }, 380 + i * 45);
                        });
                    }
                }
            }

            if (historyStack.length === 0) setUndoEnabled(false);
            if (runDeadlockCheck) checkDeadlock();
            if (persistState) saveGameState();
            return true;
        }

        async function rewindToFirstMissedClear() {
            if (isBusy || historyStack.length === 0) return;
            // Block deadlock-rewind in no-undo challenges — otherwise it bypasses
            // interceptChallengeUndo() and gives free undo through the back door.
            if (interceptChallengeUndo()) return;
            const rewindIndex = findFirstMissedClearHistoryIndex();
            if (rewindIndex < 0) {
                undo();
                return;
            }

            clearHintHighlight();
            clearRewindFocus();
            clearRewindLockTag();
            isBusy = true;
            rewindSequenceActive = true;
            setTimerRewinding(true);
            const overlay = createRewindOverlay();
            try {
                const rewindSteps = historyStack.length - rewindIndex;
                const maxDuration = getDelay(1800);
                const baseStep = getDelay(190);
                const stepDelay = Math.max(getDelay(120), Math.min(baseStep, Math.floor(maxDuration / Math.max(1, rewindSteps))));

                for (let i = 0; i < rewindSteps; i++) {
                    const didUndo = performUndoStep({
                        animateButton: true,
                        runDeadlockCheck: false,
                        persistState: false,
                        force: true
                    });
                    if (!didUndo) break;
                    if (i % 2 === 0) triggerHaptic(18);
                    await waitMs(stepDelay);
                }
                triggerHaptic([65, 35, 65]);
                const missedMove = findFirstLegalClearMove();
                showRewindFocus(missedMove);
                showRewindLockTag(missedMove);
                checkDeadlock();
                saveGameState();
            } finally {
                removeRewindOverlay(overlay);
                setTimerRewinding(false);
                rewindSequenceActive = false;
                isBusy = false;
            }
        }

        function undo() {
            if (interceptChallengeUndo()) return;
            performUndoStep();
        }

        function setMagicMomentFocus(durationMs) {
            if (magicMomentTimer) {
                clearTimeout(magicMomentTimer);
                magicMomentTimer = null;
            }
            magicMomentActive = true;
            document.body.classList.add('magic-moment-active');
            magicMomentTimer = setTimeout(() => {
                magicMomentActive = false;
                magicMomentTimer = null;
                document.body.classList.remove('magic-moment-active');
            }, durationMs);
        }

        function checkVictory() {
            if (hasWon) return;
            const all = slots.flatMap(s => s.cards);
            const isZeroClear = all.length === 0;
            const isLucky3 = all.length === 1 && all[0].val === 3;
            let luckyCardEl = null;

            if (!isZeroClear && !isLucky3) return;
            const useLuckyEnding = true;

            document.getElementById('deck-pile')?.classList.remove('deck-warn');
            if (isLucky3) {
                winCardSuit = all[0].suit;
            } else if (isZeroClear) {
                const nextCard = deck.length > 0 ? deck[deck.length - 1] : null;
                winCardSuit = nextCard && nextCard.val === 3 ? nextCard.suit : '';
            }
            hasWon = true;
            const destinyThreeCard = isZeroClear
                ? (() => {
                    const top = deck.length > 0 ? deck[deck.length - 1] : null;
                    if (top && top.val === 3) return { ...top };
                    const suit = winCardSuit || '♠';
                    return { rank: '3', suit, val: 3, color: (suit === '♥' || suit === '♦') ? 'red' : 'black' };
                })()
                : null;

            // === Stage 1: Dramatic Pause (0-600ms) ===
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0);pointer-events:none;z-index:9990;transition:background 600ms ease';
            document.body.appendChild(overlay);
            requestAnimationFrame(() => { overlay.style.background = 'rgba(0,0,0,0.3)'; });

            // PIXI WebGL win burst rings
            if (PixiLayer.ready) PixiLayer.triggerWinBurst();

            if (useLuckyEnding) {
                if (isLucky3) {
                    const slot = slots.find((s) => s.cards.length === 1 && s.cards[0].val === 3);
                    const card = slot ? document.querySelector(`#col-${slot.id} .card`) : null;
                    if (card) {
                        const rect = card.getBoundingClientRect();
                        card.style.position = 'fixed';
                        card.style.left = `${rect.left}px`;
                        card.style.top = `${rect.top}px`;
                        card.style.width = `${rect.width}px`;
                        card.style.height = `${rect.height}px`;
                        card.style.margin = '0';
                        card.style.zIndex = '10012';
                        // Move out of #board subtree so subsequent board transforms
                        // (e.g. screenShake) cannot shift this fixed element.
                        document.body.appendChild(card);
                        card.style.transition = `left ${getDelay(460)}ms cubic-bezier(0.22,0.61,0.36,1), top ${getDelay(460)}ms cubic-bezier(0.22,0.61,0.36,1), transform ${getDelay(460)}ms cubic-bezier(0.22,0.61,0.36,1), box-shadow ${getDelay(460)}ms ease`;
                        requestAnimationFrame(() => {
                            card.style.left = `${(window.innerWidth - rect.width) / 2}px`;
                            card.style.top = `${(window.innerHeight - rect.height) / 2}px`;
                        });
                        luckyCardEl = card;
                    }
                }
                const card = luckyCardEl || document.querySelector('.card');
                if (card) {
                    card.style.transform = 'scale(1.1)';
                    card.style.boxShadow = '0 0 20px var(--gold), 0 0 40px rgba(255,215,0,0.5)';
                }
            }

            // 勝利震動儀式
            winHapticCeremony(false);

            // === Stage 2: Card Celebration (600-1600ms) ===
            setTimeout(() => {
                if (useLuckyEnding) {
                    const card = luckyCardEl || document.querySelector('.card');
                    if (card) {
                        card.classList.add('lucky-three-win');
                        const r = card.getBoundingClientRect();
                        showWinRing(r.left + r.width / 2, r.top + r.height / 2);
                    }
                }
                SHAKE.light();
                ParticleSystem.emit('fireworks', window.innerWidth / 2, window.innerHeight * 0.35, { count: 30 });
                playSound('win');
            }, getDelay(600));
            if (isZeroClear && destinyThreeCard) {
                setTimeout(() => {
                    showDestinyThreeMoment(destinyThreeCard);
                }, getDelay(860));
            }

            // === Stage 3: Fireworks Show (1600-3000ms) — 左中右三波 ===
            const fwPositions = [
                [0.2, 0.25], [0.5, 0.15], [0.8, 0.3],
                [0.35, 0.35], [0.65, 0.2]
            ];
            let fwCount = 0;
            const fwTimer = setInterval(() => {
                if (fwCount >= fwPositions.length) { clearInterval(fwTimer); return; }
                const [rx, ry] = fwPositions[fwCount];
                const fireworkCount = magicMomentActive ? 12 : 28;
                ParticleSystem.emit('fireworks',
                    window.innerWidth * rx,
                    window.innerHeight * ry,
                    { count: fireworkCount }
                );
                fwCount++;
            }, getDelay(480));

            // Gentle particle rain (not overwhelming)
            winInterval = setInterval(() => {
                if (magicMomentActive && Math.random() < 0.55) return;
                ParticleSystem.emit(
                    'confetti',
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight * 0.4,
                    { count: magicMomentActive ? 2 : 5 }
                );
            }, 600);

            // === Stage 4: Panel Entrance (3000-3600ms) ===
            setTimeout(() => {
                overlay.style.background = 'rgba(0,0,0,0.5)';
                setTimeout(() => overlay.remove(), 600);
                if (currentChallengeId && isLucky3) {
                    onChallengeWin(true);
                } else {
                    showWinPanel().catch(e => console.error('[win] panel error:', e));
                }
            }, getDelay(3000));
        }

        function showDestinyThreeMoment(cardData) {
            const deckEl = document.getElementById('deck-pile');
            if (!deckEl || !cardData) return;
            setMagicMomentFocus(getDelay(1800));

            const deckRect = deckEl.getBoundingClientRect();
            const fly = createFly(cardData, deckRect, { hidden: true });
            fly.classList.add('magic-moment-fly');
            fly.style.zIndex = '10020';
            fly.style.pointerEvents = 'none';
            fly.style.transition = `left ${getDelay(560)}ms cubic-bezier(0.22, 0.61, 0.36, 1), top ${getDelay(560)}ms cubic-bezier(0.22, 0.61, 0.36, 1), transform ${getDelay(560)}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity ${getDelay(260)}ms ease`;

            const banner = document.createElement('div');
            banner.className = 'magic-moment-banner';
            banner.style.transitionDuration = `${getDelay(220)}ms`;
            const suit = cardData.suit || '♠';
            banner.innerHTML = `
                <div class="magic-moment-kicker">MAGIC MOMENT</div>
                <div class="magic-moment-text">100% 下一張是 <strong>3${suit}</strong></div>
            `;
            document.body.appendChild(banner);

            const flyRect = fly.getBoundingClientRect();
            const cardW = flyRect.width || deckRect.width;
            const cardH = flyRect.height || deckRect.height;
            const edgePad = 14;
            const topLimit = Math.max(84, Math.round(window.innerHeight * 0.16));
            const lowerLimit = Math.round(window.innerHeight * 0.66);
            const targetX = Math.min(
                window.innerWidth - cardW - edgePad,
                Math.max(edgePad, window.innerWidth / 2 - cardW / 2)
            );
            const targetY = Math.min(
                lowerLimit,
                Math.max(topLimit, window.innerHeight * 0.34)
            );

            const bannerRect = banner.getBoundingClientRect();
            const bannerW = bannerRect.width;
            const bannerH = bannerRect.height;
            const bannerGap = 16;
            const cardCenterX = targetX + cardW / 2;
            const bannerX = Math.min(
                window.innerWidth - edgePad - bannerW / 2,
                Math.max(edgePad + bannerW / 2, cardCenterX)
            );
            const bannerY = Math.max(
                edgePad,
                Math.min(targetY - bannerGap - bannerH, targetY - 8 - bannerH)
            );
            banner.style.left = `${Math.round(bannerX)}px`;
            banner.style.top = `${Math.round(bannerY)}px`;

            requestAnimationFrame(() => {
                banner.classList.add('show');
                fly.style.left = `${targetX}px`;
                fly.style.top = `${targetY}px`;
                fly.style.transform = 'scale(1.14)';
            });
            setTimeout(() => revealFlyCard(fly, cardData), getDelay(170));
            setTimeout(() => {
                fly.style.transform = 'scale(1)';
            }, getDelay(760));
            setTimeout(() => {
                banner.classList.remove('show');
                fly.style.opacity = '0';
            }, getDelay(1700));
            setTimeout(() => {
                banner.remove();
                fly.remove();
            }, getDelay(2100));
        }

        function showCombo(s) {
            if (combo < 2) return;
            // Capture state before async delay — combo may reset if player acts fast
            const capturedCombo = combo;
            comboEventsThisGame++;
            if (currentChallengeId) updateChallengeHud();
            let tier;
            if (capturedCombo >= 4) tier = 5;
            else if (capturedCombo >= 3) tier = 4;
            else tier = 3;
            const majorComboAllowed = tier >= 4 && !comboFocusActive && !shouldMinimizeMotion();
            const useLiteVariant = tier >= 4 && !majorComboAllowed;
            if (majorComboAllowed) {
                setMajorComboFocusLock(getDelay(1800));
            }

            // ── 200ms 空拍：讓上一個消除特效沉澱，再砸進來 ──
            setTimeout(() => {
                const layer = document.getElementById('fx-layer');
                const comboDiv = document.createElement('div');
                comboDiv.className = `combo-text tier-${tier}${useLiteVariant ? ' combo-lite' : ''}`;
                comboDiv.textContent = `${capturedCombo} COMBO!`;
                layer.appendChild(comboDiv);
                setTimeout(() => comboDiv.remove(), getDelay(1600));

                // ── Combo sting：三音上行確立感 ──
                if (settings.sound) {
                    playTone(700,  100, 0.028, 0.0);
                    playTone(880,  100, 0.028, 0.09);
                    playTone(1100, 130, 0.022, 0.18);
                }

                const cx = window.innerWidth / 2, cy = window.innerHeight * 0.45;

                // Theme particles for combo
                const _comboTheme = getCurrentTheme();
                if (_comboTheme && !shouldMinimizeMotion()) {
                    const _tierIdx = tier >= 5 ? 2 : tier >= 4 ? 1 : 0;
                    const _comboMult = (THEME_CONFIGS[_comboTheme]?.combo?.multipliers || [1.3, 1.8, 2.5])[_tierIdx];
                    const _speedBoosts = THEME_CONFIGS[_comboTheme]?.combo?.speedBoosts;
                    const _sBoost = _speedBoosts ? _speedBoosts[_tierIdx] : 1.0;
                    spawnThemeParticles(_comboTheme, 'clear', cx, cy, {
                        multiplier: _comboMult,
                        speedBoost: _sBoost
                    });
                }

                // ── 金邊邊框閃（tier ≥ 2）──
                if (tier >= 2 && !useLiteVariant) {
                    const borderEl = document.createElement('div');
                    borderEl.className = 'combo-border-flash';
                    document.body.appendChild(borderEl);
                    setTimeout(() => borderEl.remove(), getDelay(450));
                }

                // ── Tier-based 特效 ──
                if (useLiteVariant) {
                    ParticleSystem.emit('fountain', cx, cy, { count: 6 });
                } else if (tier >= 5) {
                    SHAKE.medium();
                    ParticleSystem.emit('fireworks', cx, cy, { count: 24 });
                    const vig = document.createElement('div');
                    vig.className = 'golden-vignette';
                    document.body.appendChild(vig);
                    setTimeout(() => vig.remove(), getDelay(1400));
                    showSpiritBeast(5);
                } else if (tier >= 4) {
                    SHAKE.light();
                    ParticleSystem.emit('confetti', cx, cy, { count: 16 });
                    const warm = document.createElement('div');
                    warm.className = 'warm-flash';
                    document.body.appendChild(warm);
                    setTimeout(() => warm.remove(), getDelay(560));
                    showSpiritBeast(4);
                } else if (tier >= 3) {
                    ParticleSystem.emit('fountain', cx, cy, { count: 10 });
                    showSpiritBeast(3);
                } else if (tier >= 2) {
                    ParticleSystem.emit('fountain', cx, cy, { count: 10 });
                }
                // combo=2: starts at tier-3 by design
            }, getDelay(200));
        }

        async function triggerHaptic(ms) {
            if (!settings.vibration) return;
            if (window.Capacitor?.isNativePlatform?.()) {
                try {
                    const { Haptics, ImpactStyle, NotificationType } = window.Capacitor.Plugins;
                    if (!Haptics) return;
                    // Map vibration pattern intensity to iOS Taptic Engine
                    const totalMs = Array.isArray(ms) ? ms.reduce((a, b) => a + b, 0) : (ms || 50);
                    if (totalMs >= 200) {
                        await Haptics.impact({ style: ImpactStyle.Heavy });
                    } else if (totalMs >= 100) {
                        await Haptics.impact({ style: ImpactStyle.Medium });
                    } else {
                        await Haptics.impact({ style: ImpactStyle.Light });
                    }
                } catch (e) { /* Haptics not available */ }
                return;
            }
            if (SUPPORTS_VIBRATE) navigator.vibrate(ms);
        }

        function spawnP(x, y) {
            ParticleSystem.emit('burst', x, y, { count: 15 });
        }

        function setFlyFace(f, data) {
            f.classList.remove('face-down');
            f.classList.remove('use-cardback');
            // 清掉 createFly(hidden) 期間注入的牌背 inline 樣式與 cb-* class，避免正面殘留牌背圖
            f.classList.forEach(cls => { if (cls.startsWith('cb-')) f.classList.remove(cls); });
            f.style.backgroundImage = '';
            f.style.backgroundSize = '';
            f.style.backgroundPosition = '';
            f.style.backgroundRepeat = '';
            f.style.backgroundColor = '';
            f.classList.toggle('red', data.color === 'red');
            f.innerHTML = `
    <div class="card-corner card-tl">
        <div class="card-rank">${data.rank}</div>
        <div class="card-suit-small">${data.suit}</div>
    </div>
    <div class="card-center-suit">${data.suit}</div>
    <div class="card-corner card-br">
        <div class="card-rank">${data.rank}</div>
        <div class="card-suit-small">${data.suit}</div>
    </div>`;
        }

        function revealFlyCard(f, data) {
            f.classList.add('flipping');
            setTimeout(() => {
                setFlyFace(f, data);
            }, getDelay(160));
            setTimeout(() => {
                f.classList.remove('flipping');
            }, getDelay(320));
        }

        function createFly(data, rect, options = {}) {
            const f = document.createElement('div');
            f.className = 'card flying';
            if (options.hidden) {
                f.classList.add('face-down');
                f.innerHTML = '';
                const cardbackId = getCurrentCardbackId();
                const cfg = getCurrentCardbackConfig();
                if (cardbackId && cardbackId !== 'classic') f.classList.add(`cb-${cardbackId}`);
                f.classList.add('use-cardback');
                f.style.backgroundImage = cfg.image || "url('../cardback/classic.png')";
                f.style.backgroundSize = 'cover';
                f.style.backgroundPosition = 'center';
                f.style.backgroundRepeat = 'no-repeat';
                f.style.backgroundColor = '';
            } else {
                setFlyFace(f, data);
            }
            f.style.left = rect.left + 'px';
            f.style.top = rect.top + 'px';
            document.body.appendChild(f);
            return f;
        }

        function animateRecycleReturn(groupsInReturnOrder) {
            if (!Array.isArray(groupsInReturnOrder) || groupsInReturnOrder.length === 0) {
                return Promise.resolve();
            }

            const fromEl = document.getElementById('discard-pile');
            const toEl = document.getElementById('deck-pile');
            if (!fromEl || !toEl) return Promise.resolve();

            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();
            const groupDelay = getDelay(55);
            const settleDelay = getDelay(220);
            const flyDur = getDelay(380);

            return new Promise((resolve) => {
                let index = 0;
                const step = () => {
                    if (index >= groupsInReturnOrder.length) {
                        // Deck shuffle wiggle
                        toEl.classList.add('deck-shuffle');
                        setTimeout(() => toEl.classList.remove('deck-shuffle'), getDelay(400));
                        // Deck number pulse
                        const deckNum = document.getElementById('deck-num');
                        if (deckNum) {
                            deckNum.classList.add('deck-num-pulse');
                            setTimeout(() => deckNum.classList.remove('deck-num-pulse'), getDelay(400));
                        }
                        setTimeout(resolve, settleDelay);
                        return;
                    }

                    const group = groupsInReturnOrder[index] || [];
                    group.forEach((card, cardIndex) => {
                        const fly = createFly(card, fromRect, { hidden: true });
                        fly.style.opacity = '0.94';
                        const midX = (fromRect.left + toRect.left) / 2;
                        const midY = Math.min(fromRect.top, toRect.top) - 25;
                        const anim = fly.animate([
                            { left: fromRect.left + 'px', top: fromRect.top + 'px', transform: 'scale(1)', opacity: 0.94 },
                            { left: midX + 'px', top: midY + 'px', transform: 'scale(0.95)', opacity: 0.7, offset: 0.45 },
                            { left: toRect.left + 'px', top: toRect.top + 'px', transform: 'scale(0.9)', opacity: 0.2 }
                        ], { duration: flyDur, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
                        anim.onfinish = () => fly.remove();
                    });

                    index += 1;
                    setTimeout(step, groupDelay);
                };
                step();
            });
        }

        function updateDiscard(pulse = false) {
            const p = document.getElementById('discard-pile');
            if (lastCleared) {
                p.innerHTML = `<div style="font-size:10px; position:absolute; top:2px; left:4px;">${lastCleared.rank}</div><div style="font-size:14px;">${lastCleared.suit}</div>`;
                p.className = `pile has-cards ${lastCleared.color}`;
                p.style.boxShadow = `3px 3px 0 rgba(255,215,0,0.4)`;
                if (pulse) {
                    p.classList.remove('discard-receive');
                    void p.offsetWidth;
                    p.classList.add('discard-receive');
                    setTimeout(() => p.classList.remove('discard-receive'), 320);
                }
            } else { p.className = 'pile'; p.innerHTML = ''; p.style.boxShadow = 'none'; }
        }

        function formatTime(totalSec) {
            const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
            const s = (totalSec % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        function formatMs(ms) {
            const sec = Math.floor(ms / 1000);
            const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
            return `${formatTime(sec)}.${cs}`;
        }

        function loadBestStats() {
            try {
                const raw = localStorage.getItem('lucky3-best-stats');
                if (!raw) return { fastestTimeSec: null, fewestMoves: null, highestCombo: 0 };
                const parsed = JSON.parse(raw);
                return {
                    fastestTimeSec: Number.isFinite(parsed.fastestTimeSec) ? parsed.fastestTimeSec : null,
                    fewestMoves: Number.isFinite(parsed.fewestMoves) ? parsed.fewestMoves : null,
                    highestCombo: Number.isFinite(parsed.highestCombo) ? parsed.highestCombo : 0
                };
            } catch (_) {
                return { fastestTimeSec: null, fewestMoves: null, highestCombo: 0 };
            }
        }

        function saveBestStats(stats) {
            try {
                localStorage.setItem('lucky3-best-stats', JSON.stringify(stats));
            } catch (_) { }
        }

        function updateBestStats(current) {
            const best = loadBestStats();
            const isNewFastest = best.fastestTimeSec == null || current.elapsedSec < best.fastestTimeSec;
            const isNewFewestMoves = best.fewestMoves == null || current.moveCount < best.fewestMoves;
            const isNewHighestCombo = current.maxCombo > (best.highestCombo || 0);

            const nextBest = {
                fastestTimeSec: isNewFastest ? current.elapsedSec : best.fastestTimeSec,
                fewestMoves: isNewFewestMoves ? current.moveCount : best.fewestMoves,
                highestCombo: isNewHighestCombo ? current.maxCombo : best.highestCombo
            };
            saveBestStats(nextBest);

            return {
                best: nextBest,
                flags: { isNewFastest, isNewFewestMoves, isNewHighestCombo }
            };
        }

        function buildBestMessage(result) {
            const flags = result.flags;
            if (flags.isNewFastest) return t('win.best.new_fastest', { time: formatTime(result.best.fastestTimeSec) });
            if (flags.isNewFewestMoves) return t('win.best.new_fewest_moves', { moves: result.best.fewestMoves });
            if (flags.isNewHighestCombo) return t('win.best.new_highest_combo', { combo: result.best.highestCombo });
            return t('win.best.summary', { time: formatTime(result.best.fastestTimeSec || 0), moves: result.best.fewestMoves || 0 });
        }

        // ── Share Image (canvas) ───────────────────────────────────────────────
        function wrapCanvasText(ctx, text, maxWidth) {
            const lines = [];
            let current = '';
            for (const char of text) {
                const test = current + char;
                if (ctx.measureText(test).width > maxWidth && current) {
                    lines.push(current);
                    current = char;
                } else {
                    current = test;
                }
            }
            if (current) lines.push(current);
            return lines;
        }

        async function buildShareImage() {
            try {
                const S = 1080;
                const canvas = document.createElement('canvas');
                canvas.width = S; canvas.height = S;
                const ctx = canvas.getContext('2d');

                // Background radial gradient
                const bg = ctx.createRadialGradient(S/2, S/2, 60, S/2, S/2, S * 0.75);
                bg.addColorStop(0, '#0f3320');
                bg.addColorStop(1, '#020c05');
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, S, S);

                // Double gold border
                ctx.strokeStyle = '#b8860b';
                ctx.lineWidth = 7;
                ctx.strokeRect(22, 22, S - 44, S - 44);
                ctx.strokeStyle = 'rgba(218,165,32,0.45)';
                ctx.lineWidth = 2;
                ctx.strokeRect(36, 36, S - 72, S - 72);

                // Corner suit glyphs
                ctx.font = '54px serif';
                ctx.fillStyle = 'rgba(218,165,32,0.2)';
                ctx.textAlign = 'left';  ctx.fillText('♣', 54, 108);
                ctx.textAlign = 'right'; ctx.fillText('♠', S - 54, 108);
                ctx.textAlign = 'left';  ctx.fillText('♥', 54, S - 52);
                ctx.textAlign = 'right'; ctx.fillText('♦', S - 54, S - 52);

                // Divider helper
                const divider = (y) => {
                    ctx.strokeStyle = 'rgba(218,165,32,0.28)';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(90, y); ctx.lineTo(S - 90, y); ctx.stroke();
                    ctx.save();
                    ctx.translate(S/2, y); ctx.rotate(Math.PI / 4);
                    ctx.fillStyle = 'rgba(218,165,32,0.45)';
                    ctx.fillRect(-4, -4, 8, 8);
                    ctx.restore();
                };

                // Title
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(218,165,32,0.45)';
                ctx.shadowBlur = 20;
                ctx.fillStyle = '#DAA520';
                ctx.font = 'bold 80px "Cinzel","Times New Roman",serif';
                ctx.fillText('LUCKY  3', S/2, 168);
                ctx.shadowBlur = 0;
                ctx.fillStyle = 'rgba(218,165,32,0.55)';
                ctx.font = '26px "Cinzel",serif';
                ctx.fillText('S O L I T A I R E', S/2, 212);

                divider(238);

                // Date + suit + result type
                const suitMap = { spade: '♠', heart: '♥', diamond: '♦', club: '♣' };
                const suitSym = suitMap[winCardSuit] || '✦';
                const resultLabel = `${suitSym}  Lucky Win`;
                ctx.fillStyle = 'rgba(218,165,32,0.7)';
                ctx.font = '26px "Cinzel",serif';
                ctx.fillText(`${toLocalDateKey()}  ·  ${resultLabel}`, S/2, 278);

                // Fortune poem area
                let statsY = 820;
                if (lastFortuneText) {
                    ctx.fillStyle = 'rgba(218,165,32,0.45)';
                    ctx.font = '28px serif';
                    ctx.fillText('✦     ✦     ✦', S/2, 350);

                    const FSIZE = 44;
                    ctx.font = `${FSIZE}px "PingFang TC","Noto Sans TC","Hiragino Sans GB","Microsoft JhengHei",sans-serif`;
                    const lines = wrapCanvasText(ctx, lastFortuneText, S - 190);
                    const lineH = FSIZE + 20;
                    const blockH = lines.length * lineH;
                    let ty = 530 - blockH / 2 + FSIZE;

                    ctx.shadowColor = 'rgba(218,165,32,0.15)';
                    ctx.shadowBlur = 28;
                    ctx.fillStyle = '#f5e8c8';
                    for (const line of lines) {
                        ctx.fillText(line, S/2, ty);
                        ty += lineH;
                    }
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = 'rgba(218,165,32,0.45)';
                    ctx.font = '28px serif';
                    ctx.fillText('✦     ✦     ✦', S/2, ty + 16);

                    divider(Math.max(ty + 62, 710));
                    statsY = Math.max(ty + 120, 780);
                } else {
                    // No fortune — faint large suit symbol
                    ctx.fillStyle = 'rgba(218,165,32,0.07)';
                    ctx.font = '360px serif';
                    ctx.fillText(suitSym, S/2, 660);
                    divider(730);
                    statsY = 820;
                }

                // Stats row
                const timeEl = document.querySelector('#win-overlay [data-format="time"]');
                const statEls = document.querySelectorAll('#win-overlay .win-stat-row strong');
                const timeStr = timeEl?.textContent || '';
                const moves = statEls[1]?.textContent || '';
                const combo = statEls[2]?.textContent || '';
                ctx.fillStyle = 'rgba(255,255,255,0.82)';
                ctx.font = '34px "Cinzel",serif';
                ctx.fillText(`${timeStr}  ·  ${moves} moves  ·  ×${combo}`, S/2, statsY);

                // Watermark
                ctx.fillStyle = 'rgba(218,165,32,0.25)';
                ctx.font = '20px "Cinzel",serif';
                ctx.fillText('Lucky 3 Solitaire', S/2, S - 50);

                return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            } catch (_) {
                return null;
            }
        }
        // ── End Share Image ────────────────────────────────────────────────────

        function buildShareText() {
            const suitEmoji = { spade: '♠️', heart: '♥️', diamond: '♦️', club: '♣️' };
            const emoji = suitEmoji[winCardSuit] || '🃏';
            const date = toLocalDateKey ? toLocalDateKey() : new Date().toISOString().slice(0, 10);
            const timeStr = document.querySelector('.win-stat-row strong[data-format="time"]')?.textContent || '';
            const movesEl = document.querySelectorAll('.win-stat-row strong');
            const moves = movesEl[1]?.textContent || '';
            const combo = movesEl[3]?.textContent || '';
            const resultLine = `🃏 ${emoji} Lucky Win`;
            return `Lucky 3 · ${date}\n⏱ ${timeStr} · 🎯 ${moves} moves · 🔥 Combo ×${combo}\n${resultLine}`;
        }

        async function shareWinResult(btn, text) {
            const blob = await buildShareImage();
            if (blob) {
                const file = new File([blob], 'lucky3.png', { type: 'image/png' });
                if (navigator.share && navigator.canShare?.({ files: [file] })) {
                    try { await navigator.share({ files: [file] }); return; } catch (_) {}
                }
            }
            // Fallback: text share or clipboard
            if (navigator.share) {
                navigator.share({ text }).catch(() => {});
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    const orig = btn.textContent;
                    btn.textContent = '✅ Copied!';
                    setTimeout(() => { btn.textContent = orig; }, 1800);
                }).catch(() => {});
            }
        }

        async function showWinPanel() {
            const old = document.getElementById('win-overlay');
            if (old) old.remove();

            const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
            const prevStats = lastGameStats ? { ...lastGameStats } : null;
            const current = { elapsedSec, moveCount, maxCombo };
            const todayKey = toLocalDateKey();
            const isFirstWinToday = achievements.lastWinDate !== todayKey;
            const fortuneText = isFirstWinToday ? fortuneBySuit(winCardSuit) : '';
            lastFortuneText = fortuneText;
            onWinDropFragment(); // 第二局起掉碎片（函式內部自行判斷）
            updateStreakFlame();
            const _dw = loadDailyWins();
            const _winCount = _dw.count;
            const _gs = loadGalleryState();
            const _nextSpec = computeDropSpec(_winCount + 1, _gs.pityNoDrop || 0);
            const _dots = [1,2,3].map(i => `<span class="today-dot${i <= _winCount ? ' filled' : ''}"></span>`).join('');
            let _hint = '';
            if (_winCount < 3 && _nextSpec.canDrop) {
                _hint = `再贏一局 → ${Math.round(_nextSpec.rate * 100)}% 獲得碎片`;
            } else if (_winCount >= 3) {
                _hint = '今日碎片任務完成 ✦';
            }
            const _progressHtml = `<div class="win-today-progress"><div class="win-today-dots">${_dots}</div>${_hint ? `<div class="win-today-hint">${_hint}</div>` : ''}</div>`;
            let _taskHint = '';
            if (_winCount === 1) _taskHint = '明日連勝 +1 🔥';
            else if (_winCount === 2 && maxCombo >= 3) _taskHint = '組合技大師！';
            else if (_winCount >= 3) _taskHint = '今日收藏任務完成 ✦';
            const _streak = (loadAchievements().currentStreak || 0);
            const bestResult = updateBestStats(current);
            const achievementResult = updateAchievementsOnWin(current, 'lucky3');
            const bestMessage = buildBestMessage(bestResult);
            const dailyMsg = markDailyChallengeWin();
            lastGameStats = { timeStr: formatTime(elapsedSec), moves: moveCount, combo: maxCombo };
            // 先建立並顯示面板（不等網路），確保面板一定出現
            const overlay = document.createElement('div');
            overlay.className = 'win-overlay';
            overlay.id = 'win-overlay';
            overlay.innerHTML = `
                <div class="win-panel">
                    ${prevStats ? `<div class="win-prev-stats">上局 ${prevStats.timeStr} · ${prevStats.moves}步 · ×${prevStats.combo}</div>` : ''}
                    <h2 class="win-title shimmer-text">LUCKY 3 JACKPOT</h2>
                    <p class="win-subtitle">${t('win.subtitle')}</p>
                    ${_progressHtml}
                    ${_taskHint ? `<div class="win-task-hint">${_taskHint}</div>` : ''}
                    ${_streak >= 1 ? `<div class="win-streak-line">🔥 連勝 ${_streak} 天</div>` : ''}
                    <div class="win-stats">
                        <div class="win-stat-row"><span>${t('win.stat.time')}</span><strong data-countup="${elapsedSec}" data-format="time">0</strong></div>
                        <div class="win-stat-row"><span>${t('win.stat.moves')}</span><strong data-countup="${moveCount}">0</strong></div>
                        <div class="win-stat-row"><span>${t('win.stat.clear_moves')}</span><strong data-countup="${clearMoveCount}">0</strong></div>
                        <div class="win-stat-row"><span>${t('win.stat.deals')}</span><strong data-countup="${dealCount}">0</strong></div>
                        <div class="win-stat-row"><span>${t('win.stat.recycles')}</span><strong data-countup="${recycleCount}">0</strong></div>
                        <div class="win-stat-row"><span>${t('win.stat.max_combo')}</span><strong data-countup="${maxCombo}">0</strong></div>
                    </div>
                    <p class="win-move-note">${t('win.stat.moves_note')}</p>
                    ${fortuneText ? `<p class="win-fortune">${fortuneText}</p>` : ''}
                    <details class="win-mystery">
                        <summary class="win-mystery-toggle">${t('win.mystery.toggle')}</summary>
                        <p class="win-mystery-body">${t('win.mystery.body')}</p>
                    </details>
                    ${dailyMsg ? `<p class="win-daily">${dailyMsg}</p>` : ''}
                    <p class="win-rank-msg" style="display:none"></p>
                    ${achievementResult.streakNotice ? `<p class="win-daily">${achievementResult.streakNotice}</p>` : ''}
                    <p class="win-best">${bestMessage}</p>
                    <button type="button" class="win-play-again" onclick="playAgain()">${t('win.play_again')}</button>
                    <button type="button" class="win-share-btn" onclick="shareWinResult(this, buildShareText())">${t('win.share')}</button>
                </div>
            `;
            document.body.appendChild(overlay);
            // 面板出現時觸發彩帶
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            setTimeout(() => {
                ParticleSystem.emit('confetti', cx - 80, cy - 50);
                ParticleSystem.emit('confetti', cx + 80, cy - 50);
                ParticleSystem.emit('fireworks', cx, cy + 30);
                ParticleSystem.emit('ribbon', cx, cy - 80);
                ParticleSystem.emit('ribbon', cx - 60, cy);
                ParticleSystem.emit('ribbon', cx + 60, cy);
            }, getDelay(200));
            // CountUp animation for stat values
            overlay.querySelectorAll('[data-countup]').forEach(el => {
                const target = parseInt(el.dataset.countup) || 0;
                if (el.dataset.format === 'time') {
                    const start = performance.now();
                    const dur = 800;
                    const up = (now) => {
                        const t = Math.min(1, (now - start) / dur);
                        const eased = 1 - Math.pow(1 - t, 3);
                        el.textContent = formatTime(Math.round(target * eased));
                        if (t < 1) requestAnimationFrame(up);
                        else el.textContent = formatTime(target);
                    };
                    requestAnimationFrame(up);
                } else {
                    animateCountUp(el, target, 800);
                }
            });
            // 非同步取得排行訊息後填入（面板已顯示，不影響呈現）
            const rankMsg = await submitDailyScoreIfNeeded(current, 'lucky3');
            if (rankMsg) {
                const rankEl = overlay.querySelector('.win-rank-msg');
                if (rankEl) { rankEl.textContent = rankMsg; rankEl.style.display = ''; }
            }
        }

        function playAgain() {
            maybeShowInterstitial(() => {
                init(true, { mode: 'normal' });
            });
        }

        function hasLegalClearInSlot(cards) {
            const len = cards.length;
            if (len < 3) return false;

            const candidates = [
                [len - 3, len - 2, len - 1],
                [0, len - 2, len - 1],
                [0, 1, len - 1]
            ];
            const uniqueCandidates = [...new Set(candidates.map(c => JSON.stringify(c)))].map(x => JSON.parse(x));

            return uniqueCandidates.some(indices => {
                if (indices.some(i => i < 0 || i >= len)) return false;
                const sum = indices.reduce((acc, i) => acc + cards[i].val, 0);
                return [9, 19, 29].includes(sum);
            });
        }

        function hasAnyLegalClear() {
            return slots.some(s => s.active && hasLegalClearInSlot(s.cards));
        }

        function findFirstMissedClearHistoryIndex() {
            return historyStack.findIndex(step => step && step.type === 'deal' && step.skippedLegalClear === true);
        }

        function hideDeadlockOverlay() {
            const overlay = document.getElementById('deadlock-overlay');
            if (overlay) overlay.remove();
            deadlockShown = false;
        }

        function showDeadlockOverlay() {
            if (deadlockShown) return;
            const old = document.getElementById('deadlock-overlay');
            if (old) old.remove();

            const canRewind = findFirstMissedClearHistoryIndex() >= 0;
            const overlay = document.createElement('div');
            overlay.className = 'deadlock-overlay';
            overlay.id = 'deadlock-overlay';
            overlay.innerHTML = `
                <div class="deadlock-panel">
                    <h3 class="deadlock-title">${t('deadlock.title')}</h3>
                    <p class="deadlock-text">${t('deadlock.body')}</p>
                    <div class="deadlock-actions">
                        <button type="button" class="deadlock-btn undo" onclick="resolveDeadlock('rewind')" ${canRewind ? '' : 'disabled'}>${t('deadlock.rewind')}</button>
                        <button type="button" class="deadlock-btn new" onclick="resolveDeadlock('new')">${t('deadlock.new')}</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            deadlockShown = true;
            triggerHaptic([80, 50, 80]);
            playSound('deadlock');
        }

        function resolveDeadlock(action) {
            hideDeadlockOverlay();
            if (action === 'rewind') {
                rewindToFirstMissedClear();
                return;
            }
            if (action === 'new') {
                init(true);
            }
        }

        // ── Hint System ──────────────────────────────────────────────
        let hintHoldTimer = null;
        let hintClearTimer = null;
        let rewindFocusTimer = null;
        let dealInputLockedUntil = 0;

        function showHintHighlight() {
            clearHintHighlight();
            dealInputLockedUntil = Date.now() + getDelay(520);
            const move = findFirstLegalClearMove();
            const deckEl = document.getElementById('deck-pile');
            if (!move) {
                // No legal move: shake DEAL button
                if (deckEl) {
                    deckEl.style.animation = 'invalid-shake 0.36s ease-in-out';
                    setTimeout(() => { if (deckEl) deckEl.style.animation = ''; }, 400);
                }
                return;
            }
            // Highlight the 3 cards
            const colEl = document.getElementById(`col-${move.slotId}`);
            if (!colEl) return;
            const cardEls = colEl.querySelectorAll('.card');
            move.indices.forEach(idx => {
                if (cardEls[idx]) cardEls[idx].classList.add('hint-highlight');
            });
            // Auto-remove after 2s
            hintClearTimer = setTimeout(clearHintHighlight, 2000);
        }

        function clearHintHighlight() {
            document.querySelectorAll('.hint-highlight').forEach(el => el.classList.remove('hint-highlight'));
            if (hintClearTimer) { clearTimeout(hintClearTimer); hintClearTimer = null; }
        }

        function clearRewindFocus() {
            document.querySelectorAll('.rewind-focus').forEach(el => el.classList.remove('rewind-focus'));
            if (rewindFocusTimer) {
                clearTimeout(rewindFocusTimer);
                rewindFocusTimer = null;
            }
        }

        function clearRewindLockTag() {
            const old = document.getElementById('rewind-lock-tag');
            if (old) old.remove();
            if (rewindLockTagTimer) {
                clearTimeout(rewindLockTagTimer);
                rewindLockTagTimer = null;
            }
        }

        function showRewindFocus(move) {
            clearRewindFocus();
            if (!move) return;
            const colEl = document.getElementById(`col-${move.slotId}`);
            if (!colEl) return;
            const cardEls = colEl.querySelectorAll('.card');
            move.indices.forEach((idx) => {
                if (cardEls[idx]) cardEls[idx].classList.add('rewind-focus');
            });
            rewindFocusTimer = setTimeout(clearRewindFocus, getDelay(3400));
        }

        function showRewindLockTag(move) {
            clearRewindLockTag();
            if (!move) return;
            const colEl = document.getElementById(`col-${move.slotId}`);
            if (!colEl) return;
            const cardEls = colEl.querySelectorAll('.card');
            const anchor = cardEls[move.indices[0]];
            if (!anchor) return;
            const rect = anchor.getBoundingClientRect();
            const tag = document.createElement('div');
            tag.className = 'rewind-lock-tag';
            tag.id = 'rewind-lock-tag';
            tag.textContent = `${t('deadlock.rewind')} ✓`;
            tag.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
            tag.style.top = `${Math.round(Math.max(42, rect.top - 18))}px`;
            document.body.appendChild(tag);
            rewindLockTagTimer = setTimeout(clearRewindLockTag, getDelay(1700));
        }

        function createRewindOverlay() {
            const overlay = document.createElement('div');
            overlay.className = 'rewind-overlay';
            overlay.id = 'rewind-overlay';
            document.body.classList.add('rewind-active');
            document.body.appendChild(overlay);
            requestAnimationFrame(() => overlay.classList.add('show'));
            return overlay;
        }

        function removeRewindOverlay(overlay) {
            if (!overlay) return;
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
            }, getDelay(220));
            document.body.classList.remove('rewind-active');
        }

        function waitMs(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        function setTimerRewinding(active) {
            const timerEl = document.getElementById('timer');
            if (!timerEl) return;
            timerEl.classList.toggle('rewinding', !!active);
        }

        function captureCardRects() {
            const map = new Map();
            document.querySelectorAll('.card[data-card-key]').forEach((el) => {
                const key = el.dataset.cardKey;
                if (!key) return;
                map.set(key, el.getBoundingClientRect());
            });
            return map;
        }

        function animateRewindCardMotion(beforeRects) {
            if (!beforeRects || beforeRects.size === 0) return;
            document.querySelectorAll('.card[data-card-key]').forEach((el) => {
                const key = el.dataset.cardKey;
                if (!key) return;
                const before = beforeRects.get(key);
                if (!before) return;
                const after = el.getBoundingClientRect();
                const dx = before.left - after.left;
                const dy = before.top - after.top;
                if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

                el.animate(
                    [
                        { transform: `translate(${dx}px, ${dy}px) scale(0.985)`, filter: 'brightness(0.95)' },
                        { transform: 'translate(0px, 0px) scale(1)', filter: 'brightness(1)' }
                    ],
                    {
                        duration: getDelay(170),
                        easing: 'cubic-bezier(0.2, 0.85, 0.25, 1)',
                        fill: 'none'
                    }
                );
                if (Math.abs(dx) + Math.abs(dy) > 24) createRewindMotionTrail(before, after);
            });
        }

        function createRewindMotionTrail(before, after) {
            const trail = document.createElement('div');
            trail.className = 'rewind-trail';
            const x1 = before.left + before.width / 2;
            const y1 = before.top + before.height / 2;
            const x2 = after.left + after.width / 2;
            const y2 = after.top + after.height / 2;
            const dist = Math.hypot(x2 - x1, y2 - y1);
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            trail.style.width = `${Math.max(12, dist)}px`;
            trail.style.left = `${x1}px`;
            trail.style.top = `${y1}px`;
            trail.style.transform = `translateY(-50%) rotate(${angle}deg)`;
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), getDelay(180));
        }

        function initHintLongPress() {
            const deckEl = document.getElementById('deck-pile');
            if (!deckEl) return;

            const startHold = () => {
                deckEl.classList.add('hint-press');
                hintHoldTimer = setTimeout(() => {
                    deckEl.classList.remove('hint-press');
                    showHintHighlight();
                }, 1500);
            };

            const cancelHold = () => {
                deckEl.classList.remove('hint-press');
                if (hintHoldTimer) { clearTimeout(hintHoldTimer); hintHoldTimer = null; }
            };

            deckEl.addEventListener('pointerdown', startHold);
            deckEl.addEventListener('pointerup',   cancelHold);
            deckEl.addEventListener('pointerleave', cancelHold);
            deckEl.addEventListener('contextmenu', e => e.preventDefault());
        }
        // ── End Hint System ───────────────────────────────────────────

        function updateUndoCountDisplay() {
            const row = document.getElementById('undo-count-row');
            const num = document.getElementById('undo-count-num');
            if (!row || !num) return;
            if (gameMode === 'daily' && dailyUndoCount > 0) {
                num.textContent = dailyUndoCount;
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }

        function setUndoEnabled(enabled) {
            const btn = document.getElementById('btn-undo');
            if (!btn) return;
            if (enabled) {
                btn.disabled = false;
                btn.classList.remove('undo-ready');
                void btn.offsetWidth; // force reflow
                btn.classList.add('undo-ready');
            } else {
                btn.disabled = true;
                btn.classList.remove('undo-ready');
            }
        }

        function updateDeckWarnState() {
            const el = document.getElementById('deck-pile');
            if (!el) return;
            const warn = deck.length === 0 && clearedGroups.length > 0 && !hasAnyLegalClear();
            el.classList.toggle('deck-warn', warn);
        }

        function checkDeadlock() {
            updateDeckWarnState();
            if (hasWon || isBusy) return false;

            if (deck.length > 0 || clearedGroups.length > 0) {
                hideDeadlockOverlay();
                return false;
            }

            if (hasAnyLegalClear()) {
                hideDeadlockOverlay();
                return false;
            }

            showDeadlockOverlay();
            return true;
        }

        function buildSavePayload() {
            const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
            return {
                deck,
                slots,
                discardPile,
                clearedGroups,
                nextSlotIndex,
                historyStack,
                combo,
                lastCleared,
                moveCount,
                clearMoveCount,
                maxCombo,
                hasWon,
                gameMode,
                currentSeed,
                currentDifficultyTag,
                elapsedSec,
                // Per-game flags (achievement integrity — without these, reload-cheating
                // can trivially earn noUndoWins / fullSweepWins / comboGameWins).
                undoUsedThisGame,
                columnsCleared,
                dealCount,
                recycleCount,
                columnClearEvents,
                comboEventsThisGame,
                columnsClearedSet: Array.from(columnsClearedSet || []),
                dailyUndoCount,
                currentGameGrade,
                winCardSuit,
                // Challenge state (without these, reload silently degrades a challenge
                // to a normal game; condition counters reset).
                currentChallengeId,
                challengeUndoViolated,
                challengeDealCount,
            };
        }

        function isValidCard(card) {
            return card && typeof card.rank === 'string' && typeof card.suit === 'string' && Number.isFinite(card.val) &&
                (card.color === 'red' || card.color === 'black');
        }

        function isValidSlot(slot) {
            return slot && Number.isInteger(slot.id) && Array.isArray(slot.cards) && typeof slot.active === 'boolean' &&
                slot.cards.every(isValidCard);
        }

        function isValidColumnClearEvent(evt) {
            return evt &&
                Number.isInteger(evt.slotId) &&
                Number.isInteger(evt.dealCount) &&
                Number.isInteger(evt.moveCount) &&
                Number.isInteger(evt.elapsedSec);
        }

        function saveGameState() {
            try {
                localStorage.setItem(GAME_STATE_KEY, JSON.stringify(buildSavePayload()));
            } catch (_) { }
        }

        function loadGameState() {
            try {
                const raw = localStorage.getItem(GAME_STATE_KEY);
                if (!raw) return false;
                const parsed = JSON.parse(raw);

                if (!Array.isArray(parsed.deck) || !Array.isArray(parsed.slots) || !Array.isArray(parsed.discardPile) || !Array.isArray(parsed.clearedGroups)) return false;
                if (!parsed.deck.every(isValidCard) || !parsed.discardPile.every(isValidCard)) return false;
                if (!parsed.slots.every(isValidSlot)) return false;
                if (!parsed.clearedGroups.every(group => Array.isArray(group) && group.every(isValidCard))) return false;

                deck = parsed.deck;
                slots = parsed.slots;
                discardPile = parsed.discardPile;
                clearedGroups = parsed.clearedGroups;
                nextSlotIndex = Number.isInteger(parsed.nextSlotIndex) ? parsed.nextSlotIndex : 0;
                historyStack = Array.isArray(parsed.historyStack) ? parsed.historyStack : [];
                combo = Number.isInteger(parsed.combo) ? parsed.combo : 0;
                lastCleared = parsed.lastCleared && isValidCard(parsed.lastCleared) ? parsed.lastCleared : null;
                moveCount = Number.isInteger(parsed.moveCount) ? parsed.moveCount : 0;
                clearMoveCount = Number.isInteger(parsed.clearMoveCount) ? parsed.clearMoveCount : 0;
                maxCombo = Number.isInteger(parsed.maxCombo) ? parsed.maxCombo : 0;
                hasWon = Boolean(parsed.hasWon);
                gameMode = parsed.gameMode === 'daily' ? 'daily' : 'normal';
                currentSeed = Number.isInteger(parsed.currentSeed) ? parsed.currentSeed : null;
                currentDifficultyTag = typeof parsed.currentDifficultyTag === 'string' ? parsed.currentDifficultyTag : '';
                // Per-game flags
                undoUsedThisGame = !!parsed.undoUsedThisGame;
                columnsCleared = Number.isInteger(parsed.columnsCleared) ? parsed.columnsCleared : 0;
                dealCount = Number.isInteger(parsed.dealCount) ? parsed.dealCount : 0;
                recycleCount = Number.isInteger(parsed.recycleCount) ? parsed.recycleCount : 0;
                columnClearEvents = Array.isArray(parsed.columnClearEvents) && parsed.columnClearEvents.every(isValidColumnClearEvent)
                    ? parsed.columnClearEvents
                    : [];
                comboEventsThisGame = Number.isInteger(parsed.comboEventsThisGame) ? parsed.comboEventsThisGame : 0;
                columnsClearedSet = new Set(Array.isArray(parsed.columnsClearedSet) ? parsed.columnsClearedSet : []);
                dailyUndoCount = Number.isInteger(parsed.dailyUndoCount) ? parsed.dailyUndoCount : 0;
                currentGameGrade = (parsed.currentGameGrade === 'g1' || parsed.currentGameGrade === 'g2' || parsed.currentGameGrade === 'g3') ? parsed.currentGameGrade : 'g2';
                winCardSuit = typeof parsed.winCardSuit === 'string' ? parsed.winCardSuit : '';
                // Challenge state
                currentChallengeId = (typeof parsed.currentChallengeId === 'string' && CHALLENGE_LEVELS.find(c => c.id === parsed.currentChallengeId)) ? parsed.currentChallengeId : null;
                challengeUndoViolated = !!parsed.challengeUndoViolated;
                challengeDealCount = Number.isInteger(parsed.challengeDealCount) ? parsed.challengeDealCount : 0;
                deadlockShown = false;
                selected = [];
                const elapsedSec = Number.isFinite(parsed.elapsedSec) ? Math.max(0, parsed.elapsedSec) : 0;
                startTime = Date.now() - elapsedSec * 1000;
                updateHeaderModeTag();
                if (currentChallengeId) {
                    showChallengeHud(true);
                    updateChallengeHud();
                }
                return true;
            } catch (_) {
                return false;
            }
        }

        window.getColumnClearEvents = function getColumnClearEvents() {
            return columnClearEvents.map((evt) => ({ ...evt }));
        };

        window.addEventListener('beforeunload', saveGameState);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) saveGameState();
        });
        window.addEventListener('resize', syncBoardScale);
        window.addEventListener('orientationchange', syncBoardScale);

        developerMode = loadDeveloperMode();
        seedCheatMode = loadSeedCheatMode();
        settings = loadSettings();
        achievements = loadAchievements();
        syncCardBackUnlocks({ showToast: false });
        updateFocusWidget();
        updateStreakFlame();
        loadCardBack();
        bindSettingsUI();
        setLocale(settings.locale, { persist: false });
        applySettings();
        if (settings.dailyNotif) setupDailyNotification(true);
        // iOS Audio unlock — must be triggered on first user gesture
        (function setupAudioUnlock() {
            const unlock = () => {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (!Ctx) return;
                if (!audioCtx) {
                    try { audioCtx = new Ctx(); } catch(e) { return; }
                }
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume().catch(() => {});
                }
                document.removeEventListener('touchstart', unlock, true);
                document.removeEventListener('click', unlock, true);
            };
            document.addEventListener('touchstart', unlock, { once: true, passive: true, capture: true });
            document.addEventListener('click', unlock, { once: true, capture: true });
        })();
        // ===== ADS SYSTEM (ads disabled pending post-launch implementation) =====

        function isNativeApp() {
            return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
        }

        function isPremium() {
            return false;
        }

        function updateAdVisibility() {
            const banner = document.getElementById('ad-banner');
            if (banner) banner.style.display = 'none';
            const premiumBtn = document.getElementById('settings-premium-btn');
            if (premiumBtn) premiumBtn.style.display = 'none';
        }

        function maybeShowInterstitial(callback) {
            if (true) { callback(); return; }
        }

        function closeInterstitial() {
            const overlay = document.getElementById('interstitial-overlay');
            if (overlay) overlay.style.display = 'none';
        }

        function initAdSystem() {
            updateAdVisibility();
        }
        // ===== END ADS SYSTEM =====

        showHomeScreen();
        initHintLongPress();
        initAdSystem();
        preloadSounds();

        // 視窗大小改變時重新計算 home screen 居中
        window.addEventListener('resize', () => {
            const hs = document.getElementById('home-screen');
            if (hs && hs.style.display !== 'none') centerHomeContent();
        });

        // === Capacitor native init ===
        (async () => {
            if (!window.Capacitor?.isNativePlatform?.()) return;
            const { SplashScreen, StatusBar } = window.Capacitor.Plugins;
            try { await StatusBar.setStyle({ style: 'DARK' }); } catch (_) {}
            try { await StatusBar.setBackgroundColor({ color: '#051d0e' }); } catch (_) {}
            try { await SplashScreen.hide({ fadeOutDuration: 300 }); } catch (_) {}
        })();
