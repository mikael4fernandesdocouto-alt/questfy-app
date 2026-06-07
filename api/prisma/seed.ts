import { PrismaClient, Difficulty, Subject, MissionType, ExamType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Questfy database...');

  // ---- ACHIEVEMENTS ----
  const achievements = [
    { name: 'Primeira Questão', description: 'Responda sua primeira questão', icon: '🎯', condition: '{"type":"questions_answered","count":1}', xpBonus: 10 },
    { name: 'Dedicado', description: 'Responda 50 questões', icon: '📚', condition: '{"type":"questions_answered","count":50}', xpBonus: 50 },
    { name: 'Mestre dos Estudos', description: 'Responda 500 questões', icon: '🏆', condition: '{"type":"questions_answered","count":500}', xpBonus: 200 },
    { name: 'Precisão', description: 'Acerte 100 questões', icon: '🎯', condition: '{"type":"correct_answers","count":100}', xpBonus: 100 },
    { name: 'Fogo Ardente', description: 'Mantenha um streak de 7 dias', icon: '🔥', condition: '{"type":"streak","days":7}', xpBonus: 100 },
    { name: 'Lendário', description: 'Mantenha um streak de 30 dias', icon: '⭐', condition: '{"type":"streak","days":30}', xpBonus: 500 },
    { name: 'Nível 10', description: 'Alcance o nível 10', icon: '💪', condition: '{"type":"level","level":10}', xpBonus: 100 },
    { name: 'Nível 50', description: 'Alcance o nível 50', icon: '👑', condition: '{"type":"level","level":50}', xpBonus: 500 },
    { name: 'Rank C', description: 'Alcance o Rank C', icon: '🟢', condition: '{"type":"rank","rank":"C"}', xpBonus: 200 },
    { name: 'Rank A', description: 'Alcance o Rank A', icon: '🟣', condition: '{"type":"rank","rank":"A"}', xpBonus: 1000 },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { name: a.name },
      update: {},
      create: a,
    });
  }
  console.log(`  ✅ ${achievements.length} achievements`);

  // ---- MISSIONS ----
  const missions = [
    { title: 'Questões do Dia', description: 'Responda 10 questões hoje', type: MissionType.DAILY, xpReward: 100, targetCount: 10 },
    { title: 'Matemática I', description: 'Resolva 5 questões de Matemática', type: MissionType.SUBJECT, xpReward: 50, targetCount: 5, subject: Subject.MATEMATICA },
    { title: 'Natureza I', description: 'Resolva 5 questões de Ciências da Natureza', type: MissionType.SUBJECT, xpReward: 50, targetCount: 5, subject: Subject.CIENCIAS_NATUREZA },
    { title: 'Humanas I', description: 'Resolva 5 questões de Ciências Humanas', type: MissionType.SUBJECT, xpReward: 50, targetCount: 5, subject: Subject.CIENCIAS_HUMANAS },
    { title: 'Linguagens I', description: 'Resolva 5 questões de Linguagens', type: MissionType.SUBJECT, xpReward: 50, targetCount: 5, subject: Subject.LINGUAGENS },
    { title: 'Semana Produtiva', description: 'Responda 50 questões em uma semana', type: MissionType.WEEKLY, xpReward: 300, targetCount: 50 },
  ];

  for (const m of missions) {
    const existing = await prisma.mission.findFirst({ where: { title: m.title } });
    if (!existing) await prisma.mission.create({ data: m });
  }
  console.log(`  ✅ ${missions.length} missions`);

  // ---- QUESTIONS (ENEM sample) ----
  const questions = [
    // MATEMÁTICA
    { statement: 'Qual é o resultado de 2³ + 3²?', difficulty: Difficulty.EASY, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2023, explanation: '2³ = 8 e 3² = 9, então 8 + 9 = 17.', alternatives: [{ text: '15', correct: false }, { text: '17', correct: true }, { text: '19', correct: false }, { text: '21', correct: false }, { text: '25', correct: false }] },
    { statement: 'Se f(x) = 2x² - 3x + 1, qual é o valor de f(2)?', difficulty: Difficulty.MEDIUM, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2023, explanation: 'f(2) = 2(4) - 3(2) + 1 = 8 - 6 + 1 = 3.', alternatives: [{ text: '1', correct: false }, { text: '3', correct: true }, { text: '5', correct: false }, { text: '7', correct: false }, { text: '9', correct: false }] },
    { statement: 'Qual é a probabilidade de obter cara em 2 lançamentos consecutivos de uma moeda honesta?', difficulty: Difficulty.MEDIUM, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2022, explanation: 'P(cara E cara) = 1/2 × 1/2 = 1/4.', alternatives: [{ text: '1/8', correct: false }, { text: '1/4', correct: true }, { text: '1/2', correct: false }, { text: '3/4', correct: false }, { text: '1', correct: false }] },
    { statement: 'A soma dos ângulos internos de um polígono convexo de n lados é:', difficulty: Difficulty.EASY, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2022, explanation: 'A fórmula é (n-2) × 180°.', alternatives: [{ text: 'n × 180°', correct: false }, { text: '(n-2) × 180°', correct: true }, { text: '(n-1) × 180°', correct: false }, { text: 'n × 90°', correct: false }, { text: '(n-2) × 90°', correct: false }] },
    { statement: 'Qual é o valor de log₁₀(1000)?', difficulty: Difficulty.EASY, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2021, explanation: 'log₁₀(1000) = log₁₀(10³) = 3.', alternatives: [{ text: '2', correct: false }, { text: '3', correct: true }, { text: '4', correct: false }, { text: '10', correct: false }, { text: '100', correct: false }] },

    // LINGUAGENS
    { statement: 'No trecho "O menino chegou correndo", o gerúndio indica:', difficulty: Difficulty.EASY, subject: Subject.LINGUAGENS, examType: ExamType.ENEM, examYear: 2023, explanation: 'O gerúndio "correndo" indica modo, uma circunstância de modo.', alternatives: [{ text: 'Tempo', correct: false }, { text: 'Modo', correct: true }, { text: 'Causa', correct: false }, { text: 'Condição', correct: false }, { text: 'Concessão', correct: false }] },
    { statement: 'Qual é a função da linguagem predominante em um poema lírico?', difficulty: Difficulty.MEDIUM, subject: Subject.LINGUAGENS, examType: ExamType.ENEM, examYear: 2022, explanation: 'No poema lírico, predomina a função emotiva (expressar sentimentos).', alternatives: [{ text: 'Referencial', correct: false }, { text: 'Emotiva', correct: true }, { text: 'Conativa', correct: false }, { text: 'Fática', correct: false }, { text: 'Metalinguística', correct: false }] },
    { statement: 'Em "Ele foi o melhor aluno da turma", o termo "melhor" é:', difficulty: Difficulty.EASY, subject: Subject.LINGUAGENS, examType: ExamType.ENEM, examYear: 2021, explanation: '"Melhor" é o superlativo de superioridade de "bom".', alternatives: [{ text: 'Comparativo de superioridade', correct: false }, { text: 'Superlativo de superioridade', correct: true }, { text: 'Comparativo de inferioridade', correct: false }, { text: 'Superlativo de inferioridade', correct: false }, { text: 'Comparativo de igualdade', correct: false }] },

    // CIÊNCIAS HUMANAS
    { statement: 'Em que ano ocorreu a Independência do Brasil?', difficulty: Difficulty.EASY, subject: Subject.CIENCIAS_HUMANAS, examType: ExamType.ENEM, examYear: 2023, explanation: 'A Independência do Brasil ocorreu em 7 de setembro de 1822.', alternatives: [{ text: '1808', correct: false }, { text: '1822', correct: true }, { text: '1889', correct: false }, { text: '1500', correct: false }, { text: '1815', correct: false }] },
    { statement: 'Quem escreveu "O Príncipe"?', difficulty: Difficulty.MEDIUM, subject: Subject.CIENCIAS_HUMANAS, examType: ExamType.ENEM, examYear: 2022, explanation: '"O Príncipe" foi escrito por Nicolau Maquiavel em 1513.', alternatives: [{ text: 'Maquiavel', correct: true }, { text: 'Rousseau', correct: false }, { text: 'Locke', correct: false }, { text: 'Hobbes', correct: false }, { text: 'Montesquieu', correct: false }] },
    { statement: 'Qual foi o principal motivo da vinda da Família Real Portuguesa para o Brasil em 1808?', difficulty: Difficulty.MEDIUM, subject: Subject.CIENCIAS_HUMANAS, examType: ExamType.ENEM, examYear: 2021, explanation: 'A invasão de Portugal pelas tropas napoleônicas forçou a fuga da corte.', alternatives: [{ text: 'Crise econômica em Portugal', correct: false }, { text: 'Invasão napoleônica', correct: true }, { text: 'Revolta no Brasil', correct: false }, { text: 'Tratado de Tordesilhas', correct: false }, { text: 'Descobrimento do ouro', correct: false }] },
    { statement: 'O Iluminismo foi um movimento intelectual que se desenvolveu principalmente em qual século?', difficulty: Difficulty.EASY, subject: Subject.CIENCIAS_HUMANAS, examType: ExamType.ENEM, examYear: 2023, explanation: 'O Iluminismo se desenvolveu no século XVIII (século das Luzes).', alternatives: [{ text: 'XVI', correct: false }, { text: 'XVII', correct: false }, { text: 'XVIII', correct: true }, { text: 'XIX', correct: false }, { text: 'XX', correct: false }] },

    // CIÊNCIAS DA NATUREZA
    { statement: 'Qual é a fórmula molecular da água?', difficulty: Difficulty.EASY, subject: Subject.CIENCIAS_NATUREZA, examType: ExamType.ENEM, examYear: 2023, explanation: 'A água é composta por 2 átomos de hidrogênio e 1 de oxigênio: H₂O.', alternatives: [{ text: 'H₂O', correct: true }, { text: 'CO₂', correct: false }, { text: 'NaCl', correct: false }, { text: 'O₂', correct: false }, { text: 'H₂', correct: false }] },
    { statement: 'Qual é a derivada de x² em relação a x?', difficulty: Difficulty.MEDIUM, subject: Subject.CIENCIAS_NATUREZA, examType: ExamType.ENEM, examYear: 2022, explanation: 'Pela regra da potência: d/dx(x²) = 2x.', alternatives: [{ text: 'x', correct: false }, { text: '2x', correct: true }, { text: 'x²', correct: false }, { text: '2x²', correct: false }, { text: '2', correct: false }] },
    { statement: 'Qual gás é mais abundante na atmosfera terrestre?', difficulty: Difficulty.EASY, subject: Subject.CIENCIAS_NATUREZA, examType: ExamType.ENEM, examYear: 2021, explanation: 'O nitrogênio (N₂) compõe cerca de 78% da atmosfera.', alternatives: [{ text: 'Oxigênio', correct: false }, { text: 'Nitrogênio', correct: true }, { text: 'Gás carbônico', correct: false }, { text: 'Hidrogênio', correct: false }, { text: 'Hélio', correct: false }] },
    { statement: 'Qual é a unidade de medida de força no Sistema Internacional?', difficulty: Difficulty.EASY, subject: Subject.CIENCIAS_NATUREZA, examType: ExamType.ENEM, examYear: 2023, explanation: 'A unidade de força no SI é o Newton (N).', alternatives: [{ text: 'Joule', correct: false }, { text: 'Watt', correct: false }, { text: 'Newton', correct: true }, { text: 'Pascal', correct: false }, { text: 'Coulomb', correct: false }] },
    { statement: 'Qual organela celular é responsável pela produção de energia (ATP)?', difficulty: Difficulty.MEDIUM, subject: Subject.CIENCIAS_NATUREZA, examType: ExamType.ENEM, examYear: 2022, explanation: 'A mitocôndria é responsável pela respiração celular e produção de ATP.', alternatives: [{ text: 'Ribossomo', correct: false }, { text: 'Mitocôndria', correct: true }, { text: 'Núcleo', correct: false }, { text: 'Retículo endoplasmático', correct: false }, { text: 'Complexo de Golgi', correct: false }] },
  ];

  const moreQuestions = [
    // MATEMÁTICA
    { statement: 'Qual é o valor de √(144)?', difficulty: Difficulty.EASY, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2020, explanation: '√144 = 12, pois 12² = 144.', alternatives: [{ text: '10', correct: false }, { text: '11', correct: false }, { text: '12', correct: true }, { text: '13', correct: false }, { text: '14', correct: false }] },
    { statement: ' Uma loja oferece um desconto de 20% sobre o preço de um produto que custa R$ 150,00. Qual é o preço com desconto?', difficulty: Difficulty.EASY, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2020, explanation: 'Desconto = 150 × 0,20 = R$ 30,00. Preço final = 150 - 30 = R$ 120,00.', alternatives: [{ text: 'R$ 100,00', correct: false }, { text: 'R$ 120,00', correct: true }, { text: 'R$ 130,00', correct: false }, { text: 'R$ 125,00', correct: false }, { text: 'R$ 110,00', correct: false }] },
    { statement: 'Se 3x + 5 = 20, qual é o valor de x?', difficulty: Difficulty.EASY, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2021, explanation: '3x + 5 = 20 → 3x = 15 → x = 5.', alternatives: [{ text: '3', correct: false }, { text: '5', correct: true }, { text: '7', correct: false }, { text: '15', correct: false }, { text: '4', correct: false }] },
    { statement: 'O gráfico de uma função afim f(x) = ax + b passa pelos pontos (0, 3) e (2, 7). Qual é o valor de a?', difficulty: Difficulty.MEDIUM, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2020, explanation: 'f(0) = b = 3. f(2) = 2a + 3 = 7 → 2a = 4 → a = 2.', alternatives: [{ text: '1', correct: false }, { text: '2', correct: true }, { text: '3', correct: false }, { text: '4', correct: false }, { text: '5', correct: false }] },
    { statement: 'Em uma PA de razão 3, o primeiro termo é 5. Qual é o 10º termo?', difficulty: Difficulty.MEDIUM, subject: Subject.MATEMATICA, examType: ExamType.ENEM, examYear: 2022, explanation: 'a_n = a_1 + (n-1)r → a_10 = 5 + 9×3 = 5 + 27 = 32.', alternatives: [{ text: '29', correct: false }, { text: '32', correct: true }, { text: '35', correct: false }, { text: '38', correct: false }, { text: '41', correct: false }] },

    // LINGUAGENS
    { statement: 'A palavra "inconstitucional" contém um prefixo. Qual é ele?', difficulty: Difficulty.EASY, subject: Subject.LINGUAGENS, examType: ExamType.ENEM, examYear: 2020, explanation: 'O prefixo é "in-" (negação), pois significa o oposto de constitucional.', alternatives: [{ text: 'in-', correct: true }, { text: 'con-', correct: false }, { text: 'tion-', correct: false }, { text: 'al-', correct: false }, { text: 'stic-', correct: false }] },
    { statement: 'Qual é a figura de linguagem na frase "O vento sussurrava nas árvores"?', difficulty: Difficulty.MEDIUM, subject: Subject.LINGUAGENS, examType: ExamType.ENEM, examYear: 2022, explanation: 'É uma personificação (prosopopeia), pois o vento (ser inanimado) "sussurra" (ação humana).', alternatives: [{ text: 'Metáfora', correct: false }, { text: 'Personificação', correct: true }, { text: 'Hipérbole', correct: false }, { text: 'Antítese', correct: false }, { text: 'Eufemismo', correct: false }] },
    { statement: 'Em "Ela cantava lindo", o adjetivo "lindo" exerce a função de:', difficulty: Difficulty.MEDIUM, subject: Subject.LINGUAGENS, examType: ExamType.ENEM, examYear: 2021, explanation: '"Lindo" é um predicativo do sujeito, pois caracteriza o sujeito "ela" através do verbo de ligação/cantava.', alternatives: [{ text: 'Adjunto adnominal', correct: false }, { text: 'Predicativo do sujeito', correct: true }, { text: 'Complemento nominal', correct: false }, { text: 'Adjunto adverbial', correct: false }, { text: 'Objeto direto', correct: false }] },

    // CIÊNCIAS HUMANAS
    { statement: 'A Revolução Francesa ocorreu em qual ano?', difficulty: Difficulty.EASY, subject: Subject.CIENCIAS_HUMANAS, examType: ExamType.ENEM, examYear: 2020, explanation: 'A Revolução Francesa teve início em 1789.', alternatives: [{ text: '1776', correct: false }, { text: '1789', correct: true }, { text: '1804', correct: false }, { text: '1815', correct: false }, { text: '1848', correct: false }] },
    { statement: 'Quem foi o primeiro presidente do Brasil?', difficulty: Difficulty.MEDIUM, subject: Subject.CIENCIAS_HUMANAS, examType: ExamType.ENEM, examYear: 2021, explanation: 'Deodoro da Fonseca foi o primeiro presidente do Brasil (1889-1891).', alternatives: [{ text: 'Getúlio Vargas', correct: false }, { text: 'Deodoro da Fonseca', correct: true }, { text: 'Dom Pedro II', correct: false }, { text: 'Prudente de Morais', correct: false }, { text: 'Floriano Peixoto', correct: false }] },
    { statement: 'O Tratado de Tordesilhas (1494) dividiu terras entre:', difficulty: Difficulty.MEDIUM, subject: Subject.CIENCIAS_HUMANAS, examType: ExamType.ENEM, examYear: 2020, explanation: 'O tratado dividiu as terras descobertas entre Portugal e Espanha.', alternatives: [{ text: 'Portugal e França', correct: false }, { text: 'Portugal e Espanha', correct: true }, { text: 'Espanha e Inglaterra', correct: false }, { text: 'Portugal e Holanda', correct: false }, { text: 'Espanha e França', correct: false }] },
    { statement: 'A abolição da escravatura no Brasil ocorreu em:', difficulty: Difficulty.EASY, subject: Subject.CIENCIAS_HUMANAS, examType: ExamType.ENEM, examYear: 2022, explanation: 'A Lei Áurea, que aboliu a escravatura, foi assinada em 13 de maio de 1888.', alternatives: [{ text: '1822', correct: false }, { text: '1888', correct: true }, { text: '1889', correct: false }, { text: '1871', correct: false }, { text: '1900', correct: false }] },

    // CIÊNCIAS DA NATUREZA
    { statement: 'Qual é a velocidade da luz no vácuo (aproximada)?', difficulty: Difficulty.EASY, subject: Subject.CIENCIAS_NATUREZA, examType: ExamType.ENEM, examYear: 2021, explanation: 'A velocidade da luz no vácuo é aproximadamente 3 × 10⁸ m/s.', alternatives: [{ text: '3 × 10⁶ m/s', correct: false }, { text: '3 × 10⁸ m/s', correct: true }, { text: '3 × 10¹⁰ m/s', correct: false }, { text: '3 × 10⁴ m/s', correct: false }, { text: '3 × 10² m/s', correct: false }] },
    { statement: 'Qual é o pH da água pura a 25°C?', difficulty: Difficulty.EASY, subject: Subject.CIENCIAS_NATUREZA, examType: ExamType.ENEM, examYear: 2020, explanation: 'A água pura é neutra, com pH = 7 a 25°C.', alternatives: [{ text: '0', correct: false }, { text: '5', correct: false }, { text: '7', correct: true }, { text: '10', correct: false }, { text: '14', correct: false }] },
    { statement: 'Na fotossíntese, as plantas convertem gás carbônico e água em:', difficulty: Difficulty.MEDIUM, subject: Subject.CIENCIAS_NATUREZA, examType: ExamType.ENEM, examYear: 2021, explanation: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Produz glicose e oxigênio.', alternatives: [{ text: 'Glicose e oxigênio', correct: true }, { text: 'Proteína e gás carbônico', correct: false }, { text: 'Lipídio e água', correct: false }, { text: 'Amido e nitrogênio', correct: false }, { text: 'Álcool e hidrogênio', correct: false }] },
  ];

  let qCount = 0;
  for (const q of [...questions, ...moreQuestions]) {
    const existing = await prisma.question.findFirst({ where: { statement: q.statement } });
    if (!existing) {
      await prisma.question.create({
        data: {
          statement: q.statement,
          difficulty: q.difficulty,
          subject: q.subject,
          examType: q.examType,
          examYear: q.examYear,
          explanation: q.explanation,
          alternatives: {
            create: q.alternatives.map(a => ({ text: a.text, isCorrect: a.correct })),
          },
        },
      });
      qCount++;
    }
  }
  console.log(`  ✅ ${qCount} questions`);

  // ---- EXAMS ----
  const exams = [
    { title: 'ENEM 2023 - Simulado Completo', type: ExamType.ENEM, year: 2023, xpReward: 300, timeLimit: 330 },
    { title: 'ENEM - Matemática', type: ExamType.ENEM, year: 2023, subject: Subject.MATEMATICA, xpReward: 100, timeLimit: 90 },
    { title: 'ENEM - Linguagens', type: ExamType.ENEM, year: 2023, subject: Subject.LINGUAGENS, xpReward: 100, timeLimit: 90 },
    { title: 'ENEM - Ciências Humanas', type: ExamType.ENEM, year: 2023, subject: Subject.CIENCIAS_HUMANAS, xpReward: 100, timeLimit: 90 },
    { title: 'ENEM - Ciências da Natureza', type: ExamType.ENEM, year: 2023, subject: Subject.CIENCIAS_NATUREZA, xpReward: 100, timeLimit: 90 },
  ];

  for (const e of exams) {
    const existing = await prisma.exam.findFirst({ where: { title: e.title } });
    if (!existing) await prisma.exam.create({ data: e });
  }
  console.log(`  ✅ ${exams.length} exams`);

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
