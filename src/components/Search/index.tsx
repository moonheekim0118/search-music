import React, { useState, useCallback } from 'react';
import { setItem, getItem, removeItem } from '../../util/localStorage';
import { searchHistory } from '../../model/searchHistory';
import Button from '../Button';
import SearchHistory from '../SearchHistory';
import useInput from '../../hooks/useInput';
import styled from 'styled-components';

const SEARCH_HISTORY = 'searchHistory';

interface Props {
    fetchAPI: (value: string) => void;
    keyword: string;
}
const Search = (props: Props) => {
    const [value, onInput, validation, setValue] = useInput(props.keyword);
    const [history, setHistory] = useState<searchHistory[]>(
        getItem(SEARCH_HISTORY)
    );

    const changeContents = useCallback(async () => {
        setItem(SEARCH_HISTORY, value); // localStorage에 기록 저장
        await props.fetchAPI(value); // 검색
        setHistory(getItem(SEARCH_HISTORY)); // searchHistory 바로 갱신
    }, [value]);

    // 검색 submit
    const onSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            await changeContents();
        },
        [value]
    );

    const onClickHistory = useCallback(
        (value: string) => async () => {
            setValue(value);
            await changeContents();
        },
        [value]
    );

    // 검색 기록 삭제
    const onRemoveHistory = useCallback(
        (e: Event, id: number) => {
            e.stopPropagation();
            removeItem(SEARCH_HISTORY, id); // localStorage에서 삭제
            setHistory(getItem(SEARCH_HISTORY)); // 삭제된 결과값 반영
        },
        [history]
    );

    return (
        <Form>
            <Input value={value} onChange={onInput} />
            <HistoryContainer>
                <SearchHistory
                    data={history}
                    onClick={onClickHistory}
                    onRemove={onRemoveHistory}
                />
            </HistoryContainer>
            <ButtonContainer>
                <Button
                    title={'submit'}
                    onClick={onSubmit}
                    type={'submit'}
                    disabled={validation}
                />
            </ButtonContainer>
        </Form>
    );
};

const Form = styled.form`
    text-align: center;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 20px 0px;
    width: 100%;
`;

const HistoryContainer = styled.div.attrs({ tabindex: '0' })`
    display: none;
    width: 100%;

    &:hover {
        display: flex;
    }

    &:focus-within {
        display: flex;
    }
`;

const Input = styled.input.attrs({ type: 'text' })`
    width: 100%;
    padding: 10px 15px;
    font-size: 1.1em;
    border: none;
    border-radius: 10px;

    &:focus {
        outline: none;
    }

    &:focus ~ ${HistoryContainer} {
        display: flex;
    }
`;

const ButtonContainer = styled.div`
    position: absolute;
    right: 0px;
`;

export default Search;
