'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    country: '',
    currency: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${backendUrl}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || data?.error || 'Registration failed');
        return;
      }

      router.push('/users/dashboard');
      router.refresh();
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border border-gray-700 space-y-6">

        {/* Top Header / Brand */}
        <div className="w-full max-w-7xl mx-auto flex justify-center">
          <h1 className="text-red-800 font-mono text-xl sm:text-2xl font-bold tracking-wider bg-gray-800 px-3 py-1 rounded">
            ACME BANK
          </h1>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-mono text-red-800">Create an Account</h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Sign up to get started with your account.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium font-mono text-red-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-red-700">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300"
              placeholder="johndoe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-red-700">Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-red-700">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-300"
            >
              <option value="" disabled>Select your country</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Botswana">Botswana</option>
              <option value="Brazil">Brazil</option>
              <option value="Brunei">Brunei</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cabo Verde">Cabo Verde</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Eswatini">Eswatini</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Greece">Greece</option>
              <option value="Grenada">Grenada</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Laos">Laos</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="North Korea">North Korea</option>
              <option value="North Macedonia">North Macedonia</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Palestine">Palestine</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Qatar">Qatar</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="Sao Tome and Principe">Sao Tome and Principe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Korea">South Korea</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Togo">Togo</option>
              <option value="Tonga">Tonga</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Vatican City">Vatican City</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-red-700">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-300"
            >
              <option value="" disabled>Select your currency</option>
              <option value="$">$ - US Dollar (USD)</option>
              <option value="€">€ - Euro (EUR)</option>
              <option value="£">£ - British Pound (GBP)</option>
              <option value="₦">₦ - Nigerian Naira (NGN)</option>
              <option value="C$">C$ - Canadian Dollar (CAD)</option>
              <option value="A$">A$ - Australian Dollar (AUD)</option>
              <option value="¥">¥ - Japanese Yen / Chinese Yuan (JPY/CNY)</option>
              <option value="₹">₹ - Indian Rupee (INR)</option>
              <option value="د.إ">د.إ - UAE Dirham (AED)</option>
              <option value="؋">؋ - Afghan Afghani (AFN)</option>
              <option value="L">L - Albanian Lek (ALL)</option>
              <option value="֏">֏ - Armenian Dram (AMD)</option>
              <option value="ƒ">ƒ - Antillean Guilder / Aruban Florin</option>
              <option value="Kz">Kz - Angolan Kwanza (AOA)</option>
              <option value="$">$ - Argentine Peso (ARS)</option>
              <option value="₼">₼ - Azerbaijani Manat (AZN)</option>
              <option value="KM">KM - Convertible Mark (BAM)</option>
              <option value="Bds$">Bds$ - Barbadian Dollar (BBD)</option>
              <option value="৳">৳ - Bangladeshi Taka (BDT)</option>
              <option value="лв">лв - Bulgarian Lev (BGN)</option>
              <option value=".د.ب">.د.ب - Bahraini Dinar (BHD)</option>
              <option value="FBu">FBu - Burundian Franc (BIF)</option>
              <option value="BD$">BD$ - Bermudan Dollar (BMD)</option>
              <option value="B$">B$ - Brunei Dollar (BND)</option>
              <option value="Bs.">Bs. - Bolivian Boliviano (BOB)</option>
              <option value="R$">R$ - Brazilian Real (BRL)</option>
              <option value="BS$">BS$ - Bahamian Dollar (BSD)</option>
              <option value="Nu.">Nu. - Bhutanese Ngultrum (BTN)</option>
              <option value="P">P - Botswanan Pula (BWP)</option>
              <option value="Br">Br - Belarusian Ruble (BYN)</option>
              <option value="BZ$">BZ$ - Belize Dollar (BZD)</option>
              <option value="FC">FC - Congolese Franc (CDF)</option>
              <option value="CHF">CHF - Swiss Franc (CHF)</option>
              <option value="CLP$">CLP$ - Chilean Peso (CLP)</option>
              <option value="COL$">COL$ - Colombian Peso (COP)</option>
              <option value="₡">₡ - Costa Rican Colón (CRC)</option>
              <option value="₱">₱ - Cuban Peso / Philippine Peso</option>
              <option value="Esc">Esc - Cape Verdean Escudo (CVE)</option>
              <option value="Kč">Kč - Czech Koruna (CZK)</option>
              <option value="Fdj">Fdj - Djiboutian Franc (DJF)</option>
              <option value="kr.">kr. - Danish / Norwegian / Swedish Krone</option>
              <option value="RD$">RD$ - Dominican Peso (DOP)</option>
              <option value="د.ج">د.ج - Algerian Dinar (DZD)</option>
              <option value="E£">E£ - Egyptian Pound (EGP)</option>
              <option value="Nfk">Nfk - Eritrean Nakfa (ERN)</option>
              <option value="Br">Br - Ethiopian Birr (ETB)</option>
              <option value="FJ$">FJ$ - Fijian Dollar (FJD)</option>
              <option value="FK£">FK£ - Falkland Islands Pound (FKP)</option>
              <option value="₾">₾ - Georgian Lari (GEL)</option>
              <option value="GH₵">GH₵ - Ghanaian Cedi (GHS)</option>
              <option value="GIP£">GIP£ - Gibraltar Pound (GIP)</option>
              <option value="D">D - Gambian Dalasi (GMD)</option>
              <option value="FG">FG - Guinean Franc (GNF)</option>
              <option value="Q">Q - Guatemalan Quetzal (GTQ)</option>
              <option value="GY$">GY$ - Guyanaese Dollar (GYD)</option>
              <option value="HK$">HK$ - Hong Kong Dollar (HKD)</option>
              <option value="Lps">Lps - Honduran Lempira (HNL)</option>
              <option value="G">G - Haitian Gourde (HTG)</option>
              <option value="Ft">Ft - Hungarian Forint (HUF)</option>
              <option value="Rp">Rp - Indonesian Rupiah (IDR)</option>
              <option value="₪">₪ - Israeli New Shekel (ILS)</option>
              <option value="ع.د">ع.د - Iraqi Dinar (IQD)</option>
              <option value="﷼">﷼ - Iranian / Omani / Qatari / Saudi Rial</option>
              <option value="kr">kr - Icelandic Króna (ISK)</option>
              <option value="J$">J$ - Jamaican Dollar (JMD)</option>
              <option value="د.ا">د.ا - Jordanian Dinar (JOD)</option>
              <option value="KSh">KSh - Kenyan Shilling (KES)</option>
              <option value="сом">сом - Kyrgyzstani Som (KGS)</option>
              <option value="៛">៛ - Cambodian Riel (KHR)</option>
              <option value="CF">CF - Comorian Franc (KMF)</option>
              <option value="₩">₩ - North / South Korean Won (KPW/KRW)</option>
              <option value="د.ك">د.ك - Kuwaiti Dinar (KWD)</option>
              <option value="CI$">CI$ - Cayman Islands Dollar (KYD)</option>
              <option value="₸">₸ - Kazakhstani Tenge (KZT)</option>
              <option value="₭">₭ - Laotian Kip (LAK)</option>
              <option value="L£">L£ - Lebanese Pound (LBP)</option>
              <option value="Rs">Rs - Sri Lankan / Pakistani / Nepalese Rupee</option>
              <option value="L$">L$ - Liberian Dollar (LRD)</option>
              <option value="L">L - Lesotho Loti (LSL)</option>
              <option value="ل.د">ل.د - Libyan Dinar (LYD)</option>
              <option value="د.م.">د.م. - Moroccan Dirham (MAD)</option>
              <option value="L">L - Moldovan Leu (MDL)</option>
              <option value="Ar">Ar - Malagasy Ariary (MGA)</option>
              <option value="ден">ден - Macedonian Denar (MKD)</option>
              <option value="Ks">Ks - Myanmar Kyat (MMK)</option>
              <option value="₮">₮ - Mongolian Tugrik (MNT)</option>
              <option value="MOP$">MOP$ - Macanese Pataca (MOP)</option>
              <option value="MRU">MRU - Mauritanian Ouguiya (MRU)</option>
              <option value="₨">₨ - Mauritian Rupee (MUR)</option>
              <option value="Rf">Rf - Maldivian Rufiyaa (MVR)</option>
              <option value="MK">MK - Malawian Kwacha (MWK)</option>
              <option value="MEX$">MEX$ - Mexican Peso (MXN)</option>
              <option value="RM">RM - Malaysian Ringgit (MYR)</option>
              <option value="MT">MT - Mozambican Metical (MZN)</option>
              <option value="N$">N$ - Namibian Dollar (NAD)</option>
              <option value="C$">C$ - Nicaraguan Córdoba (NIO)</option>
              <option value="NZ$">NZ$ - New Zealand Dollar (NZD)</option>
              <option value="B/.">B/. - Panamanian Balboa (PAB)</option>
              <option value="S/.">S/. - Peruvian Sol (PEN)</option>
              <option value="K">K - Papua New Guinean Kina (PGK)</option>
              <option value="zł">zł - Polish Zloty (PLN)</option>
              <option value="₲">₲ - Paraguayan Guarani (PYG)</option>
              <option value="lei">lei - Romanian Leu (RON)</option>
              <option value="дин.">дин. - Serbian Dinar (RSD)</option>
              <option value="₽">₽ - Russian Ruble (RUB)</option>
              <option value="FRw">FRw - Rwandan Franc (RWF)</option>
              <option value="SI$">SI$ - Solomon Islands Dollar (SBD)</option>
              <option value="SRs">SRs - Seychellois Rupee (SCR)</option>
              <option value="SDG">SDG - Sudanese Pound (SDG)</option>
              <option value="S$">S$ - Singapore Dollar (SGD)</option>
              <option value="Le">Le - Sierra Leonean Leone (SLL)</option>
              <option value="Sh.So.">Sh.So. - Somali Shilling (SOS)</option>
              <option value="Sr$">Sr$ - Surinamese Dollar (SRD)</option>
              <option value="SS£">SS£ - South Sudanese Pound (SSP)</option>
              <option value="Db">Db - São Tomé Dobra (STN)</option>
              <option value="LS">LS - Syrian Pound (SYP)</option>
              <option value="E">E - Swazi Lilangeni (SZL)</option>
              <option value="฿">฿ - Thai Baht (THB)</option>
              <option value="SM">SM - Tajikistani Somoni (TJS)</option>
              <option value="TMT">TMT - Turkmenistani Manat (TMT)</option>
              <option value="د.ت">د.ت - Tunisian Dinar (TND)</option>
              <option value="T$">T$ - Tongan Paʻanga (TOP)</option>
              <option value="₺">₺ - Turkish Lira (TRY)</option>
              <option value="TT$">TT$ - Trinidad & Tobago Dollar (TTD)</option>
              <option value="NT$">NT$ - New Taiwan Dollar (TWD)</option>
              <option value="TSh">TSh - Tanzanian Shilling (TZS)</option>
              <option value="₴">₴ - Ukrainian Hryvnia (UAH)</option>
              <option value="USh">USh - Ugandan Shilling (UGX)</option>
              <option value="$U">$U - Uruguayan Peso (UYU)</option>
              <option value="soʻm">soʻm - Uzbekistani Som (UZS)</option>
              <option value="Bs.S">Bs.S - Sovereign Bolivar (VES)</option>
              <option value="₫">₫ - Vietnamese Dong (VND)</option>
              <option value="VT">VT - Vanuatu Vatu (VUV)</option>
              <option value="WS$">WS$ - Samoan Tala (WST)</option>
              <option value="FCFA">FCFA - Central African CFA Franc (XAF)</option>
              <option value="EC$">EC$ - East Caribbean Dollar (XCD)</option>
              <option value="CFA">CFA - West African CFA Franc (XOF)</option>
              <option value="CFP">CFP - CFP Franc (XPF)</option>
              <option value="﷼">﷼ - Yemeni Rial (YER)</option>
              <option value="R">R - South African Rand (ZAR)</option>
              <option value="ZK">ZK - Zambian Kwacha (ZMW)</option>
              <option value="Z$">Z$ - Zimbabwean Dollar (ZWL)</option>
            </select>
          </div>

          {/* Password Field with Eye Toggle */}
          <div>
            <label className="block text-sm font-medium font-mono text-red-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 pr-10 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  /* Eye Open Icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  /* Eye Closed Icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field with Eye Toggle */}
          <div>
            <label className="block text-sm font-medium font-mono text-red-700">Confirm Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 pr-10 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  /* Eye Open Icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  /* Eye Closed Icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-white font-mono rounded-full bg-red-800 hover:bg-amber-600 transition-colors w-full cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 font-mono">
          Already have an account?{' '}
          <Link
            href="/users/login"
            className="text-red-700 font-medium hover:underline"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}