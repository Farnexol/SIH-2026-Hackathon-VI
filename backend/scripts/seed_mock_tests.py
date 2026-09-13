import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import uuid
from app.database import SessionLocal
from app.models import Assessment, Question, QuestionOption, Competency, UserProfile

def seed_tests():
    db = SessionLocal()
    trainer = db.query(UserProfile).filter(UserProfile.role == "trainer").first()
    creator_id = trainer.id if trainer else None

    tests_data = [
        {
            "title": "Diagnostic Mock Test: NSS Multi-Stage Sampling Design",
            "desc": "Official diagnostic evaluation on Stratified Sampling, Primary Sampling Units (PSUs), Survey Weights, and Sampling Variance in household surveys.",
            "comp_name": "NSS Multi-Stage Sampling Design",
            "questions": [
                {
                    "text": "In National Sample Survey (NSS) design, what sampling strategy is used when primary sampling units vary significantly in size?",
                    "exp": "Probability Proportional to Size (PPS) sampling, typically PPS with Systematic Sampling (PPSWR or PPSWOR), is used to account for varying unit sizes.",
                    "options": [
                        ("A", "Simple Random Sampling without Replacement (SRSWOR)", False),
                        ("B", "Probability Proportional to Size (PPS) Sampling", True),
                        ("C", "Cluster Sampling with equal selection probability", False),
                        ("D", "Quota Sampling based on enumerator discretion", False)
                    ]
                },
                {
                    "text": "What is the purpose of the multiplier (survey weight) in NSS estimation formulas?",
                    "exp": "Multipliers represent the inverse probability of selection and scale sample values up to population-level totals.",
                    "options": [
                        ("A", "To artificially normalize standard errors across strata", False),
                        ("B", "To inflate sample totals based on inverse selection probability", True),
                        ("C", "To adjust for price inflation across survey sub-rounds", False),
                        ("D", "To convert qualitative household responses into quantitative rankings", False)
                    ]
                },
                {
                    "text": "Under two-stage sampling in NSS rural sectors, what constitutes the Ultimate Sampling Unit (USU)?",
                    "exp": "In rural NSS rounds, villages are the First Stage Units (FSUs), and selected households are the Ultimate Stage Units (USUs).",
                    "options": [
                        ("A", "Revenue Village boundary", False),
                        ("B", "Sub-division Block", False),
                        ("C", "Selected Household", True),
                        ("D", "Individual Household Member", False)
                    ]
                },
                {
                    "text": "How does stratification improve efficiency compared to unstratified simple random sampling?",
                    "exp": "Stratification ensures homogeneity within strata and heterogeneity between strata, thereby reducing sampling variance.",
                    "options": [
                        ("A", "By maximizing variance within each individual stratum", False),
                        ("B", "By reducing sampling variance through intra-stratum homogeneity", True),
                        ("C", "By eliminating the need for calculating standard errors", False),
                        ("D", "By allowing non-probabilistic sample replacement in the field", False)
                    ]
                }
            ]
        },
        {
            "title": "Diagnostic Mock Test: SNA 2008 & GDP Compilation",
            "desc": "National accounts diagnostic test covering GVA estimation, FISIM allocation, Gross Capital Formation, and Sequence of Accounts.",
            "comp_name": "SNA 2008 & GDP Compilation",
            "questions": [
                {
                    "text": "Under SNA 2008, how is Gross Domestic Product (GDP) at market prices derived from Gross Value Added (GVA) at basic prices?",
                    "exp": "GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies.",
                    "options": [
                        ("A", "GDP = GVA at basic prices + Production Taxes - Production Subsidies", False),
                        ("B", "GDP = GVA at basic prices + Product Taxes - Product Subsidies", True),
                        ("C", "GDP = GVA at factor cost + Depreciation", False),
                        ("D", "GDP = Net Value Added + Operating Surplus", False)
                    ]
                },
                {
                    "text": "What does FISIM stand for in National Accounts compilation?",
                    "exp": "FISIM stands for Financial Intermediation Services Indirectly Measured, capturing financial margins between borrowing and lending rates.",
                    "options": [
                        ("A", "Fiscal Investment and Savings Index Model", False),
                        ("B", "Financial Intermediation Services Indirectly Measured", True),
                        ("C", "Foreign Institutional Securities Investment Management", False),
                        ("D", "Fixed Income Securities Inflation Margin", False)
                    ]
                },
                {
                    "text": "In SNA 2008, Research and Development (R&D) expenditure is treated as:",
                    "exp": "SNA 2008 treats R&D as Gross Fixed Capital Formation (intellectual property products) rather than intermediate consumption.",
                    "options": [
                        ("A", "Intermediate consumption of enterprises", False),
                        ("B", "Gross Fixed Capital Formation (intellectual property asset)", True),
                        ("C", "Current transfer payment to government", False),
                        ("D", "Final household consumption expenditure", False)
                    ]
                },
                {
                    "text": "Which of the following is NOT an institutional sector in the SNA Sequence of Accounts?",
                    "exp": "The institutional sectors are Non-Financial Corporations, Financial Corporations, General Government, NPISH, and Households.",
                    "options": [
                        ("A", "Non-Financial Corporations", False),
                        ("B", "Financial Corporations", False),
                        ("C", "Foreign Exchange Regulatory Authorities", True),
                        ("D", "Non-Profit Institutions Serving Households (NPISH)", False)
                    ]
                }
            ]
        },
        {
            "title": "Diagnostic Mock Test: Python for Statistical Computing",
            "desc": "Practical computing diagnostic for statistical officers on Pandas, NumPy, statistical aggregation, and automated reporting.",
            "comp_name": "Python for Statistical Computing",
            "questions": [
                {
                    "text": "In Pandas, which method is best suited for computing weighted averages across grouped survey strata?",
                    "exp": "Applying numpy.average with weights parameter via df.groupby().apply() correctly computes weighted survey stratum averages.",
                    "options": [
                        ("A", "df.groupby().mean() directly computes survey-weighted averages", False),
                        ("B", "df.groupby().apply(lambda g: np.average(g['val'], weights=g['wt']))", True),
                        ("C", "df.rolling(window=3).sum()", False),
                        ("D", "df.pivot_table(aggfunc='count')", False)
                    ]
                },
                {
                    "text": "Which library is officially recommended for high-performance vectorized operations on large sample datasets in Python?",
                    "exp": "NumPy provides N-dimensional array manipulation and vectorized statistical operations in C.",
                    "options": [
                        ("A", "Matplotlib", False),
                        ("B", "NumPy", True),
                        ("C", "BeautifulSoup", False),
                        ("D", "Tkinter", False)
                    ]
                },
                {
                    "text": "What is the correct way to handle missing survey values marked as NaN when aggregating official statistics in Pandas?",
                    "exp": "Using df.dropna(), df.fillna(), or understanding that Pandas groupby aggregations skipna=True by default prevents silent data skew.",
                    "options": [
                        ("A", "Pandas automatically replaces NaN with 0 by default in all calculations", False),
                        ("B", "Explicitly check with isna() and handle using dropna() or fillna() with imputation strategy", True),
                        ("C", "NaN values are automatically converted to infinite values", False),
                        ("D", "All calculations halt immediately and throw ValueError unless NaN is deleted manually", False)
                    ]
                },
                {
                    "text": "How can you export a cleaned official statistical table from Pandas directly to an official Excel report with multiple sheets?",
                    "exp": "Using pandas.ExcelWriter allows saving multiple DataFrames to separate named worksheets in a single Excel workbook.",
                    "options": [
                        ("A", "df.to_csv('report.xlsx', sep='\\t')", False),
                        ("B", "with pd.ExcelWriter('report.xlsx') as writer: df.to_excel(writer, sheet_name='Table_1')", True),
                        ("C", "df.export_sheets()", False),
                        ("D", "df.save_as_office_format()", False)
                    ]
                }
            ]
        }
    ]

    for t in tests_data:
        existing = db.query(Assessment).filter(Assessment.title == t["title"]).first()
        if existing:
            print("Already exists:", t["title"])
            continue
        comp = db.query(Competency).filter(Competency.name.ilike(f"%{t['comp_name']}%")).first()
        asm = Assessment(
            id=str(uuid.uuid4()),
            title=t["title"],
            description=t["desc"],
            competency_id=comp.id if comp else None,
            created_by=creator_id,
            assessment_type="mock_test",
            duration_minutes=20,
            question_count=len(t["questions"]),
            difficulty="medium",
            status="published"
        )
        db.add(asm)
        db.flush()
        for idx, q_data in enumerate(t["questions"]):
            q = Question(
                id=str(uuid.uuid4()),
                assessment_id=asm.id,
                competency_id=comp.id if comp else None,
                question_order=idx + 1,
                question_text=q_data["text"],
                question_type="single_choice",
                explanation=q_data["exp"],
                difficulty="medium"
            )
            db.add(q)
            db.flush()
            for opt_key, opt_text, is_correct in q_data["options"]:
                opt = QuestionOption(
                    id=str(uuid.uuid4()),
                    question_id=q.id,
                    option_key=opt_key,
                    option_text=opt_text,
                    is_correct=is_correct
                )
                db.add(opt)
        db.commit()
        print("Seeded:", asm.title, asm.id)

if __name__ == "__main__":
    seed_tests()
