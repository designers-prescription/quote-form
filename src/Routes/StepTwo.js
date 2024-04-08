import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Header from '../components/Header';
import StandUpPouchModal from '../components/StandUpPouchModal';
import ShrinkSleeveModal from '../components/ShrinkSleeveModal';
import BlistersModal from '../components/BlistersModal';
import BottlesModal from '../components/BottlesModal';
import BoxesModal from '../components/BoxesModal';
import CapsModal from '../components/CapsModal';


const StepTwo = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      const q = query(collection(db, 'QuoteRequirements'), orderBy('createdOn', 'desc'));
      const querySnapshot = await getDocs(q);
      const quotesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuotes(quotesData);
  };
  

    fetchQuotes();
  }, []);

  const handleEditClick = (quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuote(null);
  };

  const renderModal = () => {
    switch (selectedQuote?.product.type) {
      case 'Stand Up Pouches':
        return <StandUpPouchModal quote={selectedQuote} onClose={handleCloseModal} />;
      case 'Shrink Sleeves':
        return <ShrinkSleeveModal quote={selectedQuote} onClose={handleCloseModal} />;
      case 'Blisters':
        return <BlistersModal quote={selectedQuote} onClose={handleCloseModal} />;
      case 'Bottles':
        return <BottlesModal quote={selectedQuote} onClose={handleCloseModal} />;
      case 'Boxes':
        return <BoxesModal quote={selectedQuote} onClose={handleCloseModal} />;
      case 'Caps':
        return <CapsModal quote={selectedQuote} onClose={handleCloseModal} />;
      default:
        return null;
    }
  };
  

  return (
    <>
      <Header />

      <div className='parent-container pt-5 h-100 pb-10 p-4 sm:ml-64'>
        <h2 className='text-3xl p-10 mb-6' style={{ textAlign: 'center' }}>Update Quote</h2>
        <div className='width-full flex flex-col items-center'>
          <table style={{ maxWidth: '900px' }} className='w-full my-0 align-middle text-dark border-neutral-200'>
            <thead className='align-bottom'>
              <tr className='font-semibold text-[0.95rem] text-secondary-dark'>
                <th className='pb-3 text-start min-w-[175px]'>Customer Name</th>
                <th className='pb-3 text-end min-w-[100px]'>Sales Rep Name</th>
                <th className='pb-3 text-end min-w-[100px]'>Product Type</th>
                <th className='pb-3 pr-12 text-end min-w-[175px]'>Created On</th>
                <th className='pb-3 text-end min-w-[50px]'>Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className='border-b border-dashed last:border-b-0'>
                  <td className='p-3 pl-0'>{quote.customerName}</td>
                  <td className='p-3 pr-0 text-end'>{quote.salesRepName}</td>
                  <td className='p-3 pr-0 text-end'>{quote.product.type}</td>
                  <td className='p-3 pr-12 text-end'>{quote.createdOn.toDate().toLocaleDateString()}</td>

                  <td className='p-3 pr-0 text-end'>
                    <button className='ml-auto relative text-secondary-dark bg-light-dark hover:text-primary flex items-center h-[25px] w-[25px] text-base font-medium leading-normal text-center align-middle cursor-pointer rounded-2xl transition-colors duration-200 ease-in-out shadow-none border-0 justify-center' onClick={() => handleEditClick(quote)}>
                      <span className='flex items-center justify-center p-0 m-0 leading-none shrink-0 '> Edit
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' className='w-4 h-4'>
                          <path stroke-linecap='round' stroke-linejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                        </svg>
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {showModal && renderModal()}
      </div>
    </>
  );
};

export default StepTwo;
