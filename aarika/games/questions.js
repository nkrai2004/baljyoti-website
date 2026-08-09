const QUESTION_BANK = [
  {world:"Triangle Village", topic:"Right Triangles", q:"A right-angled triangle has one angle equal to 90°. What is the side opposite the 90° angle called?", options:["Adjacent","Opposite","Hypotenuse","Base"], answer:2, explain:"The hypotenuse is always opposite the right angle."},
  {world:"Triangle Village", topic:"Right Triangles", q:"Which set of side lengths forms a right triangle?", options:["2, 3, 4","3, 4, 5","4, 5, 6","5, 6, 7"], answer:1, explain:"3² + 4² = 5²."},
  {world:"Triangle Village", topic:"Angles", q:"If one acute angle of a right triangle is 35°, the other acute angle is:", options:["45°","55°","65°","75°"], answer:1, explain:"The two acute angles add to 90°."},
  {world:"Ratio Forest", topic:"Trigonometric Ratios", q:"For an angle θ in a right triangle, sin θ is:", options:["Adjacent / Hypotenuse","Opposite / Hypotenuse","Opposite / Adjacent","Hypotenuse / Opposite"], answer:1, explain:"SOH: sin = Opposite/Hypotenuse."},
  {world:"Ratio Forest", topic:"Trigonometric Ratios", q:"For an angle θ, cos θ equals:", options:["Opposite / Hypotenuse","Adjacent / Hypotenuse","Opposite / Adjacent","Hypotenuse / Adjacent"], answer:1, explain:"CAH: cos = Adjacent/Hypotenuse."},
  {world:"Ratio Forest", topic:"Trigonometric Ratios", q:"For an angle θ, tan θ equals:", options:["Opposite / Adjacent","Adjacent / Opposite","Opposite / Hypotenuse","Hypotenuse / Adjacent"], answer:0, explain:"TOA: tan = Opposite/Adjacent."},
  {world:"Ratio Forest", topic:"3-4-5 Challenge", q:"If opposite = 3 and hypotenuse = 5, what is sin θ?", options:["3/4","4/5","3/5","5/3"], answer:2, explain:"sin θ = opposite/hypotenuse = 3/5."},
  {world:"Ratio Mountain", topic:"Reciprocal Ratios", q:"Which ratio is the reciprocal of sin θ?", options:["cos θ","tan θ","cosec θ","cot θ"], answer:2, explain:"cosec θ = 1/sin θ."},
  {world:"Ratio Mountain", topic:"Reciprocal Ratios", q:"Which ratio is the reciprocal of cos θ?", options:["sec θ","cosec θ","cot θ","tan θ"], answer:0, explain:"sec θ = 1/cos θ."},
  {world:"Ratio Mountain", topic:"Reciprocal Ratios", q:"Which ratio is the reciprocal of tan θ?", options:["sec θ","cosec θ","cot θ","cos θ"], answer:2, explain:"cot θ = 1/tan θ."},
  {world:"Complement Bridge", topic:"Complementary Angles", q:"If θ + 30° = 90°, θ is:", options:["30°","45°","60°","90°"], answer:2, explain:"θ = 90° − 30° = 60°."},
  {world:"Complement Bridge", topic:"Complementary Angles", q:"Which is equal to sin(90° − θ)?", options:["sin θ","cos θ","tan θ","cot θ"], answer:1, explain:"sin(90° − θ) = cos θ."},
  {world:"Complement Bridge", topic:"Complementary Angles", q:"Which is equal to tan(90° − θ)?", options:["sin θ","cos θ","tan θ","cot θ"], answer:3, explain:"tan(90° − θ) = cot θ."},
  {world:"Standard Value Castle", topic:"Standard Values", q:"sin 30° is:", options:["0","1/2","√3/2","1"], answer:1, explain:"sin 30° = 1/2."},
  {world:"Standard Value Castle", topic:"Standard Values", q:"cos 60° is:", options:["0","1/2","√3/2","1"], answer:1, explain:"cos 60° = 1/2."},
  {world:"Standard Value Castle", topic:"Standard Values", q:"tan 45° is:", options:["0","1/2","1","√3"], answer:2, explain:"tan 45° = 1."},
  {world:"Standard Value Castle", topic:"Standard Values", q:"cos 0° is:", options:["0","1/2","√3/2","1"], answer:3, explain:"cos 0° = 1."},
  {world:"Standard Value Castle", topic:"Standard Values", q:"sin 90° is:", options:["0","1/2","√3/2","1"], answer:3, explain:"sin 90° = 1."},
  {world:"Identity Fortress", topic:"Identities", q:"Complete: sin²θ + cos²θ = ?", options:["0","1","tan θ","2"], answer:1, explain:"This is the fundamental Pythagorean identity."},
  {world:"Identity Fortress", topic:"Identities", q:"If sin θ = 3/5 for an acute angle, cos θ is:", options:["3/5","4/5","5/4","1/5"], answer:1, explain:"Using the 3-4-5 triangle, cos θ = 4/5."},
  {world:"Identity Fortress", topic:"Identities", q:"If tan θ = 3/4 for an acute angle, sin θ is:", options:["3/5","4/5","3/4","4/3"], answer:0, explain:"Take opposite 3, adjacent 4, hypotenuse 5; sin = 3/5."}
];

const BOSS_QUESTIONS = [
  {q:"If sin θ = 1/2 and θ is acute, θ is:", options:["30°","45°","60°","90°"], answer:0, explain:"sin 30° = 1/2."},
  {q:"If cos θ = √3/2 and θ is acute, θ is:", options:["30°","45°","60°","90°"], answer:0, explain:"cos 30° = √3/2."},
  {q:"If tan θ = 1, θ is:", options:["0°","30°","45°","60°"], answer:2, explain:"tan 45° = 1."},
  {q:"If sin θ = 3/5, then cos θ for an acute angle is:", options:["3/5","4/5","5/3","5/4"], answer:1, explain:"3-4-5 triangle gives cos θ = 4/5."},
  {q:"Which identity is always true?", options:["sin²θ + cos²θ = 1","sin θ + cos θ = 1","tan²θ = 1","sin θ = cos θ"], answer:0, explain:"The Pythagorean identity is sin²θ + cos²θ = 1."}
];
