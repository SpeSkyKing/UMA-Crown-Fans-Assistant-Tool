import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Jewel } from '../../interface/interface';
import { JewelControllerCalendarProps } from '../../interface/props';

export type JewelControllerCalendarHandle = {
    fetchJewelData: () => void;
};

export const JewelControllerCalendar = forwardRef<JewelControllerCalendarHandle, JewelControllerCalendarProps>(
  ({ token, year, month }, ref) => {

    const [jewels, setJewels] = useState<Jewel[]>([]);

    const fetchJewelData = async () => {
        try {
            if (!token) {
                console.error('トークンが見つかりません');
                return;
            }
            const response = await fetch("/api/jewelController/list", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ year: year, month: month }),
            });
            const responseJson = await response.json();
            const data = responseJson.data;
            setJewels(data);
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch jewel data:", error);
        }
    };

    useEffect(() => {
        fetchJewelData();
    },[])

    useImperativeHandle(ref, () => ({
        fetchJewelData
    }));

    const createCalendar = (year: number, month: number) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const weeks: number[][] = [];
        let week: number[] = new Array(7).fill(0);

        for (let i = 0; i < startDate.getDay(); i++) {
            week[i] = 0;
        }

        for (let day = 1; day <= endDate.getDate(); day++) {
            const currentDate = new Date(year, month - 1, day);
            week[currentDate.getDay()] = day;
            if (currentDate.getDay() === 6 || day === endDate.getDate()) {
                weeks.push(week);
                week = new Array(7).fill(0);
            }
        }

        return weeks;
    };

    const getdDiffJewel = (date:number) => {
        const today = jewels.filter(jewel => jewel.day === date).find(jewel => jewel.jewel_amount);
        const yesterday = jewels.filter(jewel => jewel.day === date -1).find(jewel => jewel.jewel_amount);

        if(today){
            if(yesterday){
                return yesterday.jewel_amount - today.jewel_amount;
            }else{
                return today.jewel_amount;
            }
        }
        return false;
    }

    return (
        <div className="border p-6 rounded shadow bg-gray-50 w-[700px] h-[400px]">
            <h3 className="text-lg mb-2 text-center">カレンダー（{year}年{month}月）</h3>
            <table className="w-full border-collapse border border-gray-400 text-center text-sm table-fixed">
                <thead>
                    <tr>
                        {['日', '月', '火', '水', '木', '金', '土'].map((weekday) => (
                            <th key={weekday} className="border border-gray-400 p-1 w-[14.28%]">
                                {weekday}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {createCalendar(year, month).map((week, i) => (
                        <tr key={i}>
                            {week.map((date, idx) => (
                                <td key={idx} className="border border-gray-300 p-1 align-top">
                                    <p>{date > 0 ? date : ''}</p>
                                    <p>
                                        {date > 0 && getdDiffJewel(date) !== false
                                            ? '+' + getdDiffJewel(date)
                                            : '-'}
                                    </p>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

